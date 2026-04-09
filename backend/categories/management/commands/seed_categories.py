from django.core.management.base import BaseCommand
from categories.models import Category, SkillTag


CATEGORIES = [
    {'name': 'Technology', 'slug': 'technology'},
    {'name': 'Design & Creative', 'slug': 'design-creative'},
    {'name': 'Marketing & Sales', 'slug': 'marketing-sales'},
    {'name': 'Writing & Content', 'slug': 'writing-content'},
    {'name': 'Finance & Accounting', 'slug': 'finance-accounting'},
    {'name': 'Customer Support', 'slug': 'customer-support'},
    {'name': 'Data & Analytics', 'slug': 'data-analytics'},
    {'name': 'Product Management', 'slug': 'product-management'},
    {'name': 'Legal & Compliance', 'slug': 'legal-compliance'},
    {'name': 'Operations & HR', 'slug': 'operations-hr'},
]

SKILL_TAGS = {
    'Technology': ['Python', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Node.js', 'Django', 'FastAPI', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API', 'iOS', 'Android', 'Flutter', 'Go', 'Rust', 'Java', 'C#', '.NET'],
    'Design & Creative': ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI Design', 'UX Design', 'Motion Graphics', 'Video Editing', 'Brand Identity', 'Canva', 'Sketch'],
    'Marketing & Sales': ['SEO', 'SEM', 'Google Ads', 'Facebook Ads', 'Content Marketing', 'Email Marketing', 'Social Media', 'Copywriting', 'Growth Hacking', 'HubSpot', 'Salesforce', 'CRM'],
    'Writing & Content': ['Blog Writing', 'Technical Writing', 'Ghostwriting', 'Proofreading', 'Translation', 'Scriptwriting', 'Grant Writing'],
    'Finance & Accounting': ['Bookkeeping', 'QuickBooks', 'Xero', 'Financial Modeling', 'Tax Preparation', 'Payroll', 'Auditing'],
    'Customer Support': ['Zendesk', 'Intercom', 'Live Chat', 'Community Management', 'Technical Support'],
    'Data & Analytics': ['SQL', 'Python', 'R', 'Tableau', 'Power BI', 'Excel', 'Machine Learning', 'Data Engineering', 'dbt'],
    'Product Management': ['Agile', 'Scrum', 'Jira', 'Product Strategy', 'Roadmapping', 'User Research', 'A/B Testing'],
    'Legal & Compliance': ['Contract Review', 'GDPR', 'IP Law', 'Privacy Policy', 'Terms of Service'],
    'Operations & HR': ['Project Management', 'Recruiting', 'Payroll', 'Process Documentation', 'Asana', 'Notion'],
}


class Command(BaseCommand):
    help = 'Seed default job categories and skill tags'

    def handle(self, *args, **kwargs):
        for cat_data in CATEGORIES:
            cat, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'slug': cat_data['slug']}
            )
            tags = SKILL_TAGS.get(cat_data['name'], [])
            for tag_name in tags:
                SkillTag.objects.get_or_create(name=tag_name)
            self.stdout.write(f"{'Created' if created else 'Exists'}: {cat.name} ({len(tags)} tags)")
        self.stdout.write(self.style.SUCCESS('Seeding complete.'))
