---
title: "Some Math Facts on Linear Algebra and Optimization"
date: 2025-01-22 14:54:26
tags: ["Linear Algebra", "Convex Optimization", "LMI"]
excerpt: "A corrected reference note on norms, cones, positive semidefinite matrices, Schur complements, and semidefinite-program duality."
---

## Norm comparisons

For $x\in\mathbb{R}^n$ and $1\le p<\infty$,
$\lVert x\rVert_p=(\sum_i|x_i|^p)^{1/p}$, while
$\lVert x\rVert_\infty=\max_i|x_i|$. If $1\le q\le p\le\infty$, then

$$
\lVert x\rVert_p\le \lVert x\rVert_q
\le n^{1/q-1/p}\lVert x\rVert_p.
\label{norm-comparison}
$$

For the first inequality, normalize $y=x/\lVert x\rVert_q$. Since
$|y_i|\le1$, $\sum_i|y_i|^p\le\sum_i|y_i|^q=1$. The second follows from
Hölder's inequality. The dimension factor in $\eqref{norm-comparison}$
matters whenever estimates are expected to scale with $n$.

## Dual, polar, and normal cones

For a cone $K\subseteq\mathbb{R}^n$, use the conventions

$$
K^*=\{y:\langle y,x\rangle\ge0\ \forall x\in K\},\qquad
K^\circ=\{y:\langle y,x\rangle\le0\ \forall x\in K\}.
$$

Thus $K^\circ=-K^*$. For a closed convex set $C$, the convex-analysis normal
cone at $x\in C$ is

$$
N_C(x)=\{y:\langle y,z-x\rangle\le0\ \forall z\in C\}.
\label{normal-cone}
$$

If $C=K$ is a convex cone, scaling $z$ and choosing $z=0$ show that

$$
N_K(x)=K^\circ\cap x^\perp=-K^*\cap x^\perp.
\label{cone-normal}
$$

The orthogonality condition alone is not sufficient: the polar-cone
condition in $\eqref{cone-normal}$ fixes the sign and is essential in KKT
systems.

## Positive semidefinite matrices

A symmetric matrix $A$ is positive semidefinite, written $A\succeq0$, exactly
when $x^\top Ax\ge0$ for every $x$. Equivalent characterizations include
$A=PP^\top$ for some $P$, nonnegative eigenvalues, and nonnegative principal
minors.

If $A=PP^\top\succeq0$ and $B=QQ^\top\succeq0$, then

$$
\operatorname{tr}(AB)
=\operatorname{tr}(P^\top QQ^\top P)
=\lVert Q^\top P\rVert_F^2\ge0.
\label{psd-trace}
$$

Notice that $\eqref{psd-trace}$ is a squared Frobenius norm, not the square of
$\operatorname{tr}(P^\top Q)$. Moreover,
$\operatorname{tr}(AB)=0$ implies $Q^\top P=0$ and therefore $AB=0$.

## Schur complements

Let

$$
M=\begin{bmatrix}A&B\\B^\top&C\end{bmatrix}
$$

be symmetric. If $C\succ0$, congruence elimination gives

$$
M\succeq0
\quad\Longleftrightarrow\quad
C\succ0\ \text{and}\ A-BC^{-1}B^\top\succeq0.
\label{schur-complement}
$$

The strict version is analogous. When the pivot is only semidefinite, the
ordinary inverse formula is invalid; one needs a generalized inverse plus a
range condition. This is why LMI derivations should state the definiteness of
the pivot explicitly.

## A standard SDP primal–dual pair

For symmetric data $C,A_1,\ldots,A_m$, consider

$$
\begin{aligned}
\text{(P)}\quad
\min_X\;&\langle C,X\rangle\\
\text{s.t. }&\langle A_i,X\rangle=b_i,\quad i=1,\ldots,m,\\
&X\succeq0.
\end{aligned}
\label{sdp-primal}
$$

Using multipliers $y\in\mathbb{R}^m$, the dual is

$$
\begin{aligned}
\text{(D)}\quad
\max_y\;&b^\top y\\
\text{s.t. }&C-\sum_{i=1}^m y_iA_i\succeq0.
\end{aligned}
\label{sdp-dual}
$$

Weak duality says every dual feasible value is a lower bound on every primal
feasible value: $b^\top y\le\langle C,X\rangle$. Under a Slater condition,
the optimal values of $\eqref{sdp-primal}$ and $\eqref{sdp-dual}$ agree and
the appropriate optimum is attained. Changing a primal minimization to a
maximization without changing the Lagrangian signs reverses this relationship,
so writing the pair together is the safest convention check.

## References

- S. Boyd and L. Vandenberghe,
  [*Convex Optimization*](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf),
  Cambridge University Press, 2004.
- S. Boyd et al.,
  [*Linear Matrix Inequalities in System and Control Theory*](https://web.stanford.edu/~boyd/lmibook/lmibook.pdf),
  SIAM, 1994.
- R. T. Rockafellar and R. J.-B. Wets, *Variational Analysis*, Springer, 1998.
