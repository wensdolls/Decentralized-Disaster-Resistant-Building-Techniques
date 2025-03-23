;; Design Registration Contract
;; Records architectural approaches for disaster resilience

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u403))
(define-constant ERR-NOT-FOUND (err u404))
(define-constant ERR-ALREADY-EXISTS (err u409))

;; Data structures
(define-map designs
  { design-id: uint }
  {
    owner: principal,
    name: (string-ascii 100),
    description: (string-ascii 500),
    disaster-types: (string-ascii 200),
    resilience-features: (string-ascii 500),
    materials-required: (string-ascii 500),
    creation-height: uint
  }
)

(define-data-var last-design-id uint u0)

;; Public functions
(define-public (register-design
                (name (string-ascii 100))
                (description (string-ascii 500))
                (disaster-types (string-ascii 200))
                (resilience-features (string-ascii 500))
                (materials-required (string-ascii 500)))
  (let ((new-id (+ (var-get last-design-id) u1)))
    (var-set last-design-id new-id)
    (map-set designs
      { design-id: new-id }
      {
        owner: tx-sender,
        name: name,
        description: description,
        disaster-types: disaster-types,
        resilience-features: resilience-features,
        materials-required: materials-required,
        creation-height: block-height
      }
    )
    (ok new-id)
  )
)

(define-public (update-design
                (design-id uint)
                (name (string-ascii 100))
                (description (string-ascii 500))
                (disaster-types (string-ascii 200))
                (resilience-features (string-ascii 500))
                (materials-required (string-ascii 500)))
  (match (map-get? designs { design-id: design-id })
    design
      (if (is-eq tx-sender (get owner design))
        (begin
          (map-set designs
            { design-id: design-id }
            {
              owner: (get owner design),
              name: name,
              description: description,
              disaster-types: disaster-types,
              resilience-features: resilience-features,
              materials-required: materials-required,
              creation-height: (get creation-height design)
            }
          )
          (ok design-id)
        )
        ERR-NOT-AUTHORIZED
      )
    ERR-NOT-FOUND
  )
)

;; Read-only functions
(define-read-only (get-design (design-id uint))
  (map-get? designs { design-id: design-id })
)

(define-read-only (get-last-design-id)
  (var-get last-design-id)
)

