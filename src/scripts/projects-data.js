/* ==========================================================================
   PROJECTS DATA REPOSITORY - PARTHIV GUPTA
   Rich technical detail, verified metrics, and architectural breakdowns.
   ========================================================================== */

export const projectsData = [
  {
    id: "tutoraaya",
    title: "TutorAaya",
    category: "flagship",
    badgeLabel: "Flagship Real-World Product",
    badgeClass: "badge-amber",
    tagline: "Offline, Hyper-Local Tutoring Marketplace with Real-Time Matching",
    shortDesc: "A complete mobile marketplace platform connecting students and verified local tutors in real-time, featuring automated proximity matching, booking workflows, and administrative verification.",
    image: "/assets/images/project-tutoraaya.webp",
    metrics: [
      { label: "Architecture", val: "Offline-First", type: "highlight" },
      { label: "Real-Time", val: "SSE + Redis", type: "cyan" },
      { label: "Deployment", val: "Dockerized", type: "rose" }
    ],
    techStack: [
      "React Native",
      "Expo Router",
      "TypeScript",
      "Zustand",
      "FastAPI",
      "Python",
      "PostgreSQL",
      "Redis",
      "SQLAlchemy",
      "JWT Auth",
      "Server-Sent Events",
      "Firebase / FCM",
      "Docker"
    ],
    problem: "Finding dependable, qualified offline tutors locally is plagued by fragmented agency directories, lack of verifiable credentials, scheduling collisions, and high intermediary costs.",
    solution: "Architected a dual-sided marketplace with strict tutor credential verification, geo-proximity clustering, real-time booking state machines, and low-latency notifications.",
    architectureDetails: [
      "Mobile Client: Built with React Native and Expo Router for cross-platform iOS/Android deployment, using Zustand for predictable offline-resilient local state management.",
      "High-Performance API: Python FastAPI backend providing asynchronous request processing, strict Pydantic validation, and SQLAlchemy ORM migrations.",
      "Real-Time Matching & Stream: Redis pub/sub and Server-Sent Events (SSE) streaming live session booking requests and tutor location status.",
      "Tutor Verification Engine: Multi-stage pipeline managing background credential checks, identity verification, subject certifications, and admin approval gates.",
      "Session Booking State Machine: ACID transaction handling in PostgreSQL with optimistic locking to prevent concurrent double-booking of physical slots."
    ],
    codeSnippet: `// FastAPI + SQLAlchemy Booking State Machine
@router.post("/sessions/{session_id}/accept", response_model=SessionResponse)
async def accept_tutoring_session(
    session_id: UUID,
    current_tutor: Tutor = Depends(get_verified_tutor),
    db: AsyncSession = Depends(get_db_session),
    redis: RedisClient = Depends(get_redis)
):
    async with db.begin():
        session = await db.get(TutoringSession, session_id, with_for_update=True)
        if session.status != SessionStatus.PENDING:
            raise HTTPException(status_code=409, detail="Session slot already allocated")
        
        session.tutor_id = current_tutor.id
        session.status = SessionStatus.CONFIRMED
        await db.commit()

    # Emit real-time notification to student via Redis SSE channel
    await redis.publish(
        f"student:{session.student_id}:events",
        json.dumps({"event": "SESSION_CONFIRMED", "tutor_name": current_tutor.full_name})
    )
    return session`,
    highlights: [
      "Engineered hyper-local geo-indexing to match tutors within custom radius boundaries",
      "Implemented comprehensive student and tutor onboarding workflows with JWT authorization",
      "Designed real-time booking state machine with automated expiration and cancellation recovery"
    ]
  },
  {
    id: "spine-classifier",
    title: "Lumbar Spine Deformity Classifier",
    category: "aiml",
    badgeLabel: "Final-Year AI / Deep Learning",
    badgeClass: "badge-magenta",
    tagline: "Medical Computer Vision & Vertebral Deformity Classification",
    shortDesc: "A deep learning medical imaging classification system utilizing transfer learning with MobileNetV2 to analyze sagittal spinal MRI/X-ray scans and identify spinal deformities.",
    image: "/assets/images/project-spine.webp",
    metrics: [
      { label: "Backbone", val: "MobileNetV2", type: "highlight" },
      { label: "Domain", val: "Medical CV", type: "cyan" },
      { label: "Framework", val: "TensorFlow / Keras", type: "rose" }
    ],
    techStack: [
      "Python",
      "TensorFlow",
      "Keras",
      "MobileNetV2",
      "Transfer Learning",
      "Convolutional Neural Networks",
      "Scikit-learn",
      "Computer Vision",
      "OpenCV",
      "NumPy"
    ],
    problem: "Manual diagnostic screening of spinal conditions (spondylolisthesis, lumbar scoliosis, disc herniation, and degenerative disc narrowing) from sagittal scans is cognitively demanding and vulnerable to diagnostic variance in high-patient environments.",
    solution: "Developed an automated medical image classification pipeline fine-tuning a pre-trained MobileNetV2 backbone on sagittal lumbar imaging with dedicated CLAHE preprocessing and spatial augmentation.",
    architectureDetails: [
      "Medical Image Preprocessing: Applied Contrast Limited Adaptive Histogram Equalization (CLAHE) to amplify subtle soft-tissue and vertebrae bone contrast across MRI scans.",
      "Transfer Learning Pipeline: Retained pre-trained MobileNetV2 low-level feature extractors while retraining top convolutional blocks with dropout regularization to avoid overfitting on limited medical samples.",
      "Vertebral Landmark Mapping: Model trained to isolate L1-L5 vertebrae and the sacral junction, assisting in spinal alignment and angle deviation checks.",
      "Rigorous Evaluation: Validated on stratified patient splits evaluating precision, recall, specificity, and confusion matrix distribution."
    ],
    codeSnippet: `# MobileNetV2 Transfer Learning Architecture for Lumbar Imaging
import tensorflow as tf
from tensorflow.keras import layers, Model

def build_spine_classifier(input_shape=(224, 224, 3), num_classes=4):
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights='imagenet'
    )
    # Freeze initial layers; fine-tune upper convolutional blocks
    base_model.trainable = True
    for layer in base_model.layers[:-30]:
        layer.trainable = False

    inputs = layers.Input(shape=input_shape)
    x = layers.Rescaling(1./255)(inputs)
    x = layers.RandomRotation(0.05)(x)
    x = layers.RandomZoom(0.05)(x)
    
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dense(128, activation='relu')(x)
    x = layers.Dropout(0.4)(x)
    outputs = layers.Dense(num_classes, activation='softmax')(x)
    
    model = Model(inputs, outputs, name="lumbar_spine_mobilenetv2")
    return model`,
    highlights: [
      "Formulated transfer learning architecture with MobileNetV2 for parameter-efficient clinical inference",
      "Built custom image augmentation pipeline handling rotational variations and contrast variances",
      "Analyzed vertebral deformities including disc herniation and scoliosis angles"
    ]
  },
  {
    id: "voicemail-ai",
    title: "Voicemail AI & Answering Machine Detection Platform",
    category: "aiml",
    badgeLabel: "Event-Driven Speech AI System",
    badgeClass: "badge-blue",
    tagline: "Real-Time Telephony Classification: Human vs. Voicemail/IVR in < 6 Seconds",
    shortDesc: "An event-driven early-call classification platform that analyzes call audio in real time, combining 550 acoustic and transcript features to classify calls with 96.31% accuracy.",
    image: "/assets/images/project-voicemail.webp",
    metrics: [
      { label: "Accuracy", val: "96.31%", type: "highlight" },
      { label: "F1 Score", val: "92.87%", type: "cyan" },
      { label: "Features", val: "550 Hybrid", type: "rose" }
    ],
    techStack: [
      "Python",
      "FastAPI",
      "Vosk ASR",
      "librosa",
      "Scikit-learn",
      "Redis Consumer Groups",
      "PostgreSQL",
      "React",
      "Event-Driven Architecture"
    ],
    problem: "Outbound automated telephony systems waste significant SIP trunk costs and agent idle time listening to answering machines, carrier error tones, and IVR greetings instead of speaking with live humans.",
    solution: "Engineered an event-driven platform processing up to the first 6 seconds of streaming call audio, combining acoustic spectral features with automatic speech recognition (ASR) vocabulary features to immediately classify calls as HUMAN or VOICEMAIL/IVR.",
    architectureDetails: [
      "Event-Driven Worker Topology: Decoupled audio chunk ingestion, feature extraction, aggregation, and ML inference workers using Redis Consumer Groups for independent horizontal scaling.",
      "550-Feature Hybrid Classification: Combines 50 acoustic signal features (MFCCs, spectral roll-off, pitch jitter, zero-crossing rate via librosa) with 500 n-gram transcript vocabulary features from Vosk ASR.",
      "High-Performance Classification Engine: Trained and validated on held-out call datasets, achieving 96.31% accuracy and 92.87% F1 score.",
      "FastAPI & Telemetry Dashboard: Built REST APIs with token-bucket rate limiting, PostgreSQL persistence for historical audit trails, and a React real-time dashboard."
    ],
    codeSnippet: `# Redis Consumer Worker: Audio Feature Extraction Pipeline
import librosa
import numpy as np

def extract_50_acoustic_features(audio_buffer, sample_rate=16000):
    y = np.frombuffer(audio_buffer, dtype=np.int16).astype(np.float32) / 32768.0
    
    # 13 MFCCs + delta + delta-delta
    mfccs = librosa.feature.mfcc(y=y, sr=sample_rate, n_mfcc=13)
    mfcc_mean = np.mean(mfccs, axis=1)
    mfcc_var = np.var(mfccs, axis=1)
    
    # Spectral properties
    spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=y, sr=sample_rate))
    spectral_rolloff = np.mean(librosa.feature.spectral_rolloff(y=y, sr=sample_rate))
    zcr = np.mean(librosa.feature.zero_crossing_rate(y))
    
    # Voiced vs Unvoiced Energy Ratio
    energy = np.sum(y ** 2) / len(y)
    
    features = np.hstack([mfcc_mean, mfcc_var, [spectral_centroid, spectral_rolloff, zcr, energy]])
    return features[:50]  # Standardized 50 acoustic vectors`,
    highlights: [
      "Achieved 96.31% accuracy and 92.87% F1 on held-out dataset split within the initial 6-second window",
      "Designed horizontal scaling architecture utilizing Redis consumer groups for asynchronous workers",
      "Combined Vosk ASR real-time transcription with Librosa acoustic signal analysis"
    ]
  },
  {
    id: "geolocation-service",
    title: "IP Geolocation Lookup Microservice",
    category: "systems",
    badgeLabel: "Production Backend · Octinix / Linkio FiberNet",
    badgeClass: "badge-blue",
    tagline: "High-Availability Dual-Stack (IPv4/IPv6) Geolocation Resolution Engine",
    shortDesc: "A production FastAPI microservice engineered for Linkio FiberNet, implementing a cache-first Redis architecture and multi-tier fallback pipeline for high-throughput IP resolution.",
    image: "/assets/images/project-geolocation.webp",
    metrics: [
      { label: "Cache TTL", val: "24 Hours", type: "highlight" },
      { label: "Protocols", val: "IPv4 + IPv6", type: "cyan" },
      { label: "Throughput", val: "+25% Optimized", type: "rose" }
    ],
    techStack: [
      "FastAPI",
      "Python",
      "Redis",
      "SQLite",
      "DB-IP",
      "GeoLite2",
      "RIPE Stat APIs",
      "Pydantic V2",
      "MMDB",
      "Docker"
    ],
    problem: "Linkio FiberNet needed continuous, sub-millisecond IP intelligence (ASN, postal codes, geographic coordinates, and ISP metadata) across billions of requests while avoiding external API rate limits and single points of failure.",
    solution: "Built a high-availability FastAPI microservice utilizing a 24-hour TTL Redis cache-first layer, memory-resident MMDB readers for local IP-range resolution, and resilient fallback workflows with RIPE Stat APIs.",
    architectureDetails: [
      "Multi-Layer Resolution: Tier 1 (Redis In-Memory) -> Tier 2 (Memory-Resident GeoLite2/DB-IP Radix Trees) -> Tier 3 (Async RIPE Stat WHOIS enrichment).",
      "Cache-First Efficiency: 24-hour TTL in Redis slashed redundant lookup latency and downstream backend query load by over 82%.",
      "Schema Validation & Type Safety: Pydantic models ensuring structured REST responses with location, ASN, timezone, postal code, and network metadata.",
      "Optimized Data Structures: In-memory MMDB readers and optimized IP-range indexing eliminating disk read bottlenecks during high-frequency traffic."
    ],
    codeSnippet: `# FastAPI Cache-First Geolocation Endpoint with Memory-Resident MMDB
@app.get("/api/v1/lookup/{ip_address}", response_model=GeolocationResponse)
async def lookup_ip_geolocation(
    ip_address: str,
    redis_client: Redis = Depends(get_redis_pool)
):
    ip_obj = ipaddress.ip_address(ip_address) # Validate IPv4 / IPv6
    cache_key = f"geo:{ip_obj.compressed}"

    # 1. Tier 1: Cache-First In-Memory Redis Lookup
    cached_data = await redis_client.get(cache_key)
    if cached_data:
        return GeolocationResponse.model_validate_json(cached_data)

    # 2. Tier 2: Memory-Resident Radix Tree (MMDB) Lookup
    geo_record = mmdb_reader.lookup(ip_obj)
    if not geo_record:
        # 3. Tier 3: Async Fallback to RIPE Stat External API
        geo_record = await fetch_ripe_stat_fallback(ip_address)

    response_payload = GeolocationResponse.from_raw(geo_record)
    
    # Store with 24-Hour TTL
    await redis_client.setex(cache_key, 86400, response_payload.model_dump_json())
    return response_payload`,
    highlights: [
      "Engineered multi-layer resolution pipeline spanning Redis, SQLite, DB-IP, GeoLite2, and RIPE Stat APIs",
      "Designed cache-first architecture with 24-hour TTL reducing lookup latency to sub-millisecond speeds",
      "Created structured Pydantic models with complete IPv4 and IPv6 dual-stack compatibility"
    ]
  }
];
