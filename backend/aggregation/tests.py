from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import FetchLog
from .parsers.base import BaseJobParser
from jobs.models import Job

User = get_user_model()


class FetchLogModelTest(TestCase):
    def test_create_fetch_log(self):
        log = FetchLog.objects.create(source='remotive_rss')
        self.assertEqual(log.status, 'running')
        self.assertIsNone(log.completed_at)
        self.assertIsNone(log.duration_seconds)

    def test_duration_seconds_none_when_not_complete(self):
        log = FetchLog.objects.create(source='remotive_rss')
        self.assertIsNone(log.duration_seconds)


class ConcreteParser(BaseJobParser):
    source_name = 'test'

    def fetch(self):
        return []


class BaseParserTest(TestCase):
    def test_base_parser_raises_not_implemented(self):
        with self.assertRaises(TypeError):
            BaseJobParser()

    def test_normalize_sets_defaults(self):
        parser = ConcreteParser()
        raw = {
            'title': 'Senior Dev',
            'company_name': 'Acme',
            'description': 'A job.',
            'source_url': 'https://example.com/job/1',
        }
        normalized = parser.normalize(raw)
        self.assertEqual(normalized['source_name'], 'test')
        self.assertTrue(normalized['is_aggregated'])
        self.assertEqual(normalized['remote_type'], 'fully_remote')
        self.assertEqual(normalized['status'], 'active')
        self.assertTrue(normalized['is_active'])


class IngestorTest(TestCase):
    def test_deduplication_by_source_url(self):
        from .ingestor import ingest_jobs
        log = FetchLog.objects.create(source='remotive_rss')
        jobs = [{
            'title': 'Test Job',
            'company_name': 'TestCo',
            'description': 'A job.',
            'source_url': 'https://example.com/unique-job-1',
            'application_url': 'https://example.com/unique-job-1',
            'location': 'Remote',
            'job_type': 'full_time',
            'remote_type': 'fully_remote',
            'category_hint': None,
            'tags': [],
        }]
        counts1 = ingest_jobs(jobs, log)
        counts2 = ingest_jobs(jobs, log)
        self.assertEqual(counts1['created'], 1)
        self.assertEqual(counts2['created'], 0)
        self.assertEqual(counts2['skipped'], 1)
        self.assertEqual(Job.objects.filter(source_url='https://example.com/unique-job-1').count(), 1)
