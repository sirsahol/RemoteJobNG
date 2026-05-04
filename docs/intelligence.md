# Intelligence & Semantic Matching

The Intelligence module provides AI-driven matching capabilities by leveraging semantic embeddings and vector similarity search.

---

## Core Technologies

- **pgvector**: A PostgreSQL extension for storing and querying vector embeddings.
- **Sentence Transformers**: Used to generate 384-dimensional embeddings (standard model: `all-MiniLM-L6-v2`).
- **Cosine Similarity**: The mathematical method used to calculate match scores between users and jobs.

---

## Data Models

### `JobEmbedding`
Stores the semantic vector representation of a job listing.
- `job`: One-to-one link to the `Job` model.
- `vector`: 384-dimension vector field.
- `last_synced_at`: Tracks when the embedding was last generated.

### `UserEmbedding`
Stores the semantic vector representation of a user's profile (skills, bio, experience).
- `user`: One-to-one link to the `User` model.
- `vector`: 384-dimension vector field.

### `ATSMatch`
Stores the pre-calculated match score between a user and a job.
- `user`: The job seeker.
- `job`: The target job.
- `score`: A float from 0.0 to 1.0.
- `analysis`: A JSON field containing a breakdown of why the match score was assigned (e.g., keyword overlap, seniority match).

---

## The Matching Pipeline

1. **Embedding Generation**: 
   - When a job is posted, a background signal triggers the generation of its embedding.
   - When a user updates their profile, their embedding is regenerated.
2. **Vector Search**:
   - The system performs a K-Nearest Neighbors (KNN) search in PostgreSQL to find jobs whose vectors are closest to the user's profile vector.
3. **Scoring & Analysis**:
   - The raw cosine similarity score is normalized.
   - An LLM or specialized engine performs a secondary analysis to populate the `analysis` JSON field.

---

## API Endpoints

### `GET /api/v1/intelligence/matches/`
Returns a list of jobs sorted by their semantic match score for the authenticated user.

### `GET /api/v1/intelligence/analysis/?job_id={id}`
Returns the detailed `ATSMatch` analysis for a specific job.
