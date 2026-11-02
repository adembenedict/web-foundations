SnapShare Scaling Plan1. Assumptions and Daily Active Users (DAU)Registered Users: 10,000,000Daily Active User (DAU) Rate: 10% of registered usersDaily Uploads per Active User: 1 photo per dayDaily Feed Views per Active User: 50 feed pages per dayAverage Photo Size: 2 MBAverage Thumbnail Size: 50 KBPeak Traffic Multiplier: $5\times$ average trafficCalculation of DAU$$\text{DAU} = 10,000,000 \times 0.10 = 1,000,000 \text{ active users/day}$$2. Traffic and Storage CalculationsA. Uploads Per Second (Writes)Daily Uploads: $1,000,000 \text{ DAU} \times 1 \text{ upload/day} = 1,000,000 \text{ uploads/day}$Average Uploads/sec:$$\frac{1,000,000}{86,400 \text{ seconds}} \approx 11.57 \text{ uploads/sec}$$Peak Uploads/sec ($5\times$):$$11.57 \times 5 \approx 57.85 \text{ uploads/sec (approx. 58 uploads/sec)}$$B. Feed Views Per Second (Reads)Daily Feed Views: $1,000,000 \text{ DAU} \times 50 \text{ feed views/day} = 50,000,000 \text{ feed views/day}$Average Feed Views/sec:$$\frac{50,000,000}{86,400 \text{ seconds}} \approx 578.7 \text{ reads/sec (approx. 579 reads/sec)}$$Peak Feed Views/sec ($5\times$):$$578.7 \times 5 \approx 2,893.5 \text{ reads/sec (approx. 2,894 reads/sec)}$$C. Photo Storage Per YearTotal Photos Uploaded/Year: $1,000,000 \text{ uploads/day} \times 365 \text{ days} = 365,000,000 \text{ photos/year}$Raw Photo Storage/Year: $365,000,000 \times 2 \text{ MB} = 730,000,000 \text{ MB} = 730 \text{ TB}$Thumbnail Storage/Year: $365,000,000 \times 50 \text{ KB} = 18,250,000,000 \text{ KB} \approx 17.4 \text{ TB}$Total Storage/Year: $730 \text{ TB} + 17.4 \text{ TB} = \mathbf{747.4 \text{ TB/year}}$3. System Characterization: Read-Heavy vs. Write-HeavySnapShare is heavily read-heavy.What this means for the design: Because users view 50 feed pages for every 1 photo they upload, read operations outnumber write operations by a factor of 50 ($50M \text{ feed views}$ vs $1M \text{ uploads}$). Consequently, the architecture must prioritize caching layers, database read replicas, and content delivery networks (CDNs) to efficiently serve read traffic without saturating core application servers or primary databases.4. Why Photos Should Not Be Stored in the DatabaseRelational or NoSQL databases are optimized for structured tabular data, indexing, ACID transactions, and fast querying—not for storing massive binary blobs (like 2 MB image files). Storing photos directly in a database bloats database backup sizes, causes severe performance degradation due to I/O bottlenecks, and wastes expensive database memory caching binary data instead of active indexes.Where they should go instead: Raw photos and generated thumbnails must be stored in distributed Object Storage (e.g., Amazon S3), while the database only stores lightweight metadata (e.g., photo URL, user ID, upload timestamp, caption).

[ Clients / Mobile Apps ]
│
▼
[ CDN (Cloudflare) ] ──(Serves Cached Media/Thumbnails)
│
▼
[ Load Balancer (Nginx) ]
│
┌──────────┴──────────┐
▼ ▼
[ App Server 1 ] [ App Server 2 ]
│ │
├─────────────────────┼───────────────┐
▼ ▼ ▼
[ Redis Cache ] [ Primary DB ] [ Message Queue ]
(Writes / Read) │
▲ ▼
[ Read Replica ] [ Background Worker ]
(Feed Reads) │
▼
[ Object Storage ]
(S3 / Blob Storage)

                                   6. Component Explanations

CDN: Caches and delivers static media assets and thumbnails edge-close to users to minimize latency and offload traffic from origin servers.

Load Balancer: Distributes incoming user HTTP requests evenly across multiple application servers to ensure high availability and prevent single-point overload.

App Servers: Stateless compute nodes that execute application business logic, process authentication, handle API requests, and coordinate reads/writes.

Cache: In-memory key-value store (Redis) that holds frequently accessed user feeds and session data to reduce database query load.

Database (Primary with Read Replica): Primary handles all write transactions (user profiles, photo metadata), while read replicas scale out feed and metadata query reads.

Object Storage: Scalable, durable blob storage system (e.g., Amazon S3) designed to securely house massive volumes of raw photo files and generated thumbnails.

Queue with Worker: Asynchronous message broker (e.g., RabbitMQ/SQS) and background worker pool that offloads heavy, non-blocking tasks like image resizing and thumbnail generation.

7. Step-by-Step Upload Flow
   Initiate Upload: The client app sends an HTTP POST request containing the photo binary to the Load Balancer.

Route to App Server: The Load Balancer forwards the request to an available App Server.

Store Raw Photo: The App Server uploads the raw 2 MB photo file directly to Object Storage and receives a public/private storage URL.

Save Metadata: The App Server writes the photo record (URL, caption, user ID, timestamp) to the Primary Database.

Enqueue Job: The App Server pushes an asynchronous job payload (containing the photo reference) to the Message Queue and immediately responds to the client with a "Upload Successful" status.

Background Processing: A Background Worker pulls the job from the queue, downloads the raw photo from Object Storage, generates a 50 KB thumbnail, and uploads the thumbnail back to Object Storage.

8. Architectural Trade-offs
   Eventual Consistency vs. Immediate Thumbnail Availability: By using an asynchronous background queue for thumbnail generation, users get a fast upload response, but their feed might display a placeholder or lack thumbnails for a brief moment until the worker finishes processing.

Read Replicas vs. Replication Lag: Utilizing database read replicas allows us to effortlessly scale our heavy read traffic, but introduces minor replication lag where a user who just published a post might experience a split-second delay before seeing it appear in their own feed.
