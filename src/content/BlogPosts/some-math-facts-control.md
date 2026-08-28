---
title: "Some Math Facts Behind Control Theory"
date: 2025-01-22 14:54:26
tags: ["Control Theory", "Stability", "Lyapunov"]
excerpt: "Continuous- and discrete-time Lyapunov tests, matrix exponentials, and spectral mappings with corrected quantifiers and matrix ordering."
---

## Continuous-time Lyapunov stability

A real square matrix $A$ is Hurwitz if every eigenvalue has negative real
part. The Lyapunov theorem states

$$
A\ \text{is Hurwitz}
\quad\Longleftrightarrow\quad
\forall Q\succ0,\ \exists!\ P\succ0:
A^\top P+PA=-Q.
\label{ct-lyapunov}
$$

For the forward direction, define

$$
P=\int_0^\infty e^{A^\top t}Qe^{At}\,dt.
\label{ct-integral}
$$

The transpose and multiplication order in $\eqref{ct-integral}$ are
important. Exponential decay makes the integral finite, and for $x\ne0$,
$x^\top Px=\int_0^\infty(e^{At}x)^\top Q(e^{At}x)\,dt>0$. Differentiating
$e^{A^\top t}Qe^{At}$ and integrating from zero to infinity yields
$A^\top P+PA=-Q$.

Conversely, suppose $P\succ0$ and $A^\top P+PA\prec0$. If $A$ were not
Hurwitz, there would exist a nonzero (possibly complex) initial direction
whose trajectory does not converge exponentially to zero. It is not true
that *every* nonzero initial condition must fail to converge. The quadratic
Lyapunov inequality nevertheless implies uniform exponential decay for all
real initial conditions, giving the contradiction.

## Discrete-time Lyapunov stability

A matrix $F$ is Schur stable when $\rho(F)<1$. Its Lyapunov theorem is

$$
F\ \text{is Schur}
\quad\Longleftrightarrow\quad
\forall Q\succ0,\ \exists!\ P\succ0:
F^\top PF-P=-Q.
\label{dt-lyapunov}
$$

When $F$ is Schur,

$$
P=\sum_{k=0}^{\infty}(F^\top)^kQF^k
\label{dt-series}
$$

is convergent and satisfies $\eqref{dt-lyapunov}` by telescoping. This is the
discrete analogue of $\eqref{ct-integral}$.

## Sampling and the matrix exponential

For zero input over a sample interval $h>0$,
$x((k+1)h)=e^{Ah}x(kh)$. The spectral mapping theorem gives

$$
\sigma(e^{Ah})=\{e^{h\lambda}:\lambda\in\sigma(A)\}.
\label{spectral-mapping}
$$

Therefore $A$ is Hurwitz if and only if $e^{Ah}$ is Schur for every $h>0$
(equivalently, for any one fixed $h>0$). There is no “sufficiently small
sampling period” restriction for this autonomous stability statement.
Small-$h$ restrictions arise in numerical approximations or sampled-data
feedback design, not in the exact exponential.

## Cayley transforms

The bilinear map

$$
F=(I+A)(I-A)^{-1}
\label{cayley-forward}
$$

maps the open left half-plane to the open unit disk, provided $I-A$ is
invertible. Its inverse is

$$
A=(F-I)(F+I)^{-1},
\label{cayley-inverse}
$$

provided $-1\notin\sigma(F)$. On eigenvalues, the map is
$\mu=(1+\lambda)/(1-\lambda)$. These signs are easy to reverse accidentally;
testing $\lambda=-1$, which maps to $\mu=0$, is a quick check.

## A useful LMI interpretation

The strict inequality

$$
A^\top P+PA\prec0,\qquad P\succ0
$$

is linear in $P$ when $A$ is fixed, hence it is an LMI feasibility problem.
It certifies one quadratic metric shared by every trajectory. If $A$ depends
on parameters, requiring one constant $P$ can be conservative; parameter-
dependent certificates reduce conservatism but introduce polynomial or
rational dependence that must itself be certified. That is precisely the
setting in which grid- and Bernstein-based tools become useful.

## References

- S. Boyd, [EE363 Lyapunov stability lecture notes](https://web.stanford.edu/class/ee363/lectures/lyap.pdf).
- H. K. Khalil, *Nonlinear Systems*, 3rd ed., Prentice Hall, 2002.
- R. A. Horn and C. R. Johnson, *Matrix Analysis*, 2nd ed., Cambridge
  University Press, 2012.
