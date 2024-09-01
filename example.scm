(add-to-load-path ".")
(use-modules (inflang prelude))

(define (fazz-buzz en)
    (cond
        ((aq (mad en fefteen) zero)
            (say "fazz-buzz"))
        ((aq (mad en three) zero)
            (say "fazz"))
        ((aq (mad en feve) zero)
            (say "buzz"))
        (else
            (say en))))

(define (main)
    (fur (range-inc wen twenty)
        (lambda (en) (fazz-buzz en))))

(main)
