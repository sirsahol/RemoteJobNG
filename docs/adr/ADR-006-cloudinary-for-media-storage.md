# ADR-006: Cloudinary for Media/File Storage

**Date**: 2025-03-20  
**Status**: Accepted  
**Deciders**: @sirsahol  

---

## Context

The platform requires file storage for:
- **User avatars** — profile pictures for job seekers and employers
- **Resumes/CVs** — PDF or DOCX files uploaded by job seekers and attached to applications
- **Company logos** — uploaded by employers when posting jobs

Files must be:
- Persistent across deployments (can't live on the Django container filesystem)
- Served efficiently to users globally (not proxied through the Django app server)
- Accessible by URL in API responses
- Safe (no arbitrary file execution)

---

## Decision

Use **Cloudinary** via `django-cloudinary-storage` for all media file storage. Cloudinary replaces Django's default `FileSystemStorage` — model `ImageField` and `FileField` automatically upload to and serve from Cloudinary.

---

## Rationale

1. **Zero-server-storage**: Files upload directly to Cloudinary's CDN — the Django server never stores media files on disk. This is essential for containerised (Docker) deployments where container storage is ephemeral.

2. **CDN delivery**: Cloudinary serves files via a global CDN. Avatars and resume PDFs are served from the edge — fast for users globally, with no bandwidth cost to the Django server.

3. **Image transformations on-demand**: Cloudinary's URL-based transformation API (e.g. `c_fill,w_200,h_200` for avatars) enables responsive images without pre-generating multiple sizes.

4. **`django-cloudinary-storage` integration**: Drop-in replacement for Django's default storage backend — one environment variable and two settings lines. All `ImageField` and `FileField` automatically use Cloudinary. No custom upload handling needed.

5. **Free tier generosity**: Cloudinary's free tier (25 credits/month, ~25GB bandwidth, ~25GB storage) is sufficient for Phase 1 scale. No upfront cost.

6. **Security**: Files are stored outside the application server — no path traversal or arbitrary file execution risk. Cloudinary enforces file type validation independently.

---

## Alternatives Considered

| Option | Reason Rejected |
|---|---|
| **Local filesystem (`FileSystemStorage`)** | Files are lost on container restart. Doesn't scale across multiple backend instances. Can't serve from CDN. Absolute blocker for Docker-based deployment. |
| **AWS S3** | Strong choice but adds IAM, bucket policy, and CORS configuration complexity. Costs money from day one (no meaningful free tier). `django-storages[boto3]` requires more setup than `django-cloudinary-storage`. Better for Phase 2+ when volume justifies the operational overhead. |
| **Google Cloud Storage** | Same tradeoffs as S3. Excellent at scale but overkill for Phase 1. |
| **DigitalOcean Spaces** | S3-compatible, simpler pricing. Less global CDN coverage than Cloudinary. No built-in image transformations. |
| **Self-hosted MinIO** | Requires running and maintaining a separate MinIO cluster. Operational burden not justified for Phase 1. |
| **Base64 inline storage** | Storing images as base64 in the database is an anti-pattern — bloats DB, breaks caching, has no CDN delivery. |

---

## Configuration

```python
# settings.py
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.environ.get('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.environ.get('CLOUDINARY_API_KEY'),
    'API_SECRET': os.environ.get('CLOUDINARY_API_SECRET'),
}
```

Or via `CLOUDINARY_URL` environment variable (format: `cloudinary://api_key:api_secret@cloud_name`).

Models use standard Django fields — Cloudinary storage is transparent:

```python
class User(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
```

---

## Consequences

### Positive
- Media files survive container restarts and redeployments
- Avatars and resumes are served from Cloudinary's CDN — zero Django server bandwidth for file delivery
- Avatar transformations (`c_fill,w_200,h_200,g_face`) for consistent profile picture sizing
- Free tier covers Phase 1 scale
- No custom upload endpoint needed — `FileField`/`ImageField` handle everything

### Negative / Trade-offs
- External service dependency — if Cloudinary is down, file uploads fail. Mitigated by graceful error handling in upload forms.
- Free tier limits: 25GB storage and 25GB bandwidth/month. If user-uploaded content grows significantly (many resumes, high-res avatars), will need to upgrade to a paid plan or migrate to S3.
- Cloudinary URL format exposes cloud name in public URLs — not a security issue but worth noting (`res.cloudinary.com/<cloud_name>/image/upload/...`).
- Deleting files requires Cloudinary API calls — Django's `delete()` on a model doesn't auto-delete the Cloudinary asset. A signal or management command is needed for cleanup (planned for Phase 2).

---

## References
- [django-cloudinary-storage docs](https://github.com/klis87/django-cloudinary-storage)
- [Cloudinary free tier](https://cloudinary.com/pricing)
- [Cloudinary image transformations](https://cloudinary.com/documentation/image_transformations)
