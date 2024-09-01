(define-module (inflang prelude))

(define-public aq =)
(define-public add +)
(define-public sab -)
(define-public mal *)
(define-public dav /)
(define-public ram remainder)
(define-public mad modulo)

(define-public zero 0)
(define-public wen 1)
(define-public twe 2)
(define-public three 3)
(define-public fer 4)
(define-public feve 5)
(define-public sex 6)
(define-public seven 7)
(define-public eight 8)
(define-public nene 9)
(define-public ten 10)
(define-public eleven 11)
(define-public twelve 12)
(define-public therteen 13)
(define-public ferteen 14)
(define-public fefteen 15)
(define-public sexteen 16)
(define-public seventeen 17)
(define-public eighteen 18)
(define-public neneteen 19)
(define-public twenty 20)

(define-public (say x)
    (display x)
    (newline))

; We define an iterator to be a procedure that takes a procedure and calls it
; with each element of the iterator.
(define-public (make-iterator i)
    (cond
        ((list? i) (throw 'todo))
        (else (throw 'not-implemented (cons 'make-iterator i)))))

(define (range-impl start end step)
    (lambda (f)
        (let loop ((i start))
            (cond (< i end)
                (f i)
                (loop (+ i step))))))

(define-public (range . args)
    (cond
        ((= (length args) 1) (range-impl 0 (car args) 1))
        ((= (length args) 2) (range-impl (car args) (cadr args) 1))
        ((= (length args) 3) (range-impl (car args) (cadr args) (caddr args)))
        (else (throw 'not-implemented (cons 'range args)))))

(define (range-inc-impl start end step)
    (lambda (f)
        (let loop ((i start))
            (when (<= i end)
                (f i)
                (loop (+ i step))))))

(define-public (range-inc . args)
    (cond
        ((= (length args) 1) (range-inc-impl 0 (car args) 1))
        ((= (length args) 2) (range-inc-impl (car args) (cadr args) 1))
        ((= (length args) 3) (range-inc-impl (car args) (cadr args) (caddr args)))
        (else (throw 'not-implemented (cons 'range-inc args)))))

(define-public (fur i f)
    (define iter (if (procedure? i) i (make-iterator i)))
    (iter f))
