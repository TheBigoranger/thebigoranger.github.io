---
title: "Some Math Facts on Linear Algebra and Optimization"
date: 2025-01-22 14:54:26
tags: ["Linear Algebra", "Convex Optimization", "LMI"]
excerpt: "A corrected reference note on norms, cones, positive semidefinite matrices, Schur complements, and semidefinite-program duality."
---

## Norm comparisons

For $x\in\mathbb{R}^n$ and $p\in(0,\infty]$, define

$$
\lVert x\rVert_p=
\begin{cases}
\left(\sum_{i=1}^n|x_i|^p\right)^{1/p},&0<p<\infty,\\
\max_i|x_i|,&p=\infty.
\end{cases}
$$

This is a norm when $p\ge1$; for $0<p<1$ it is a useful quasi-norm but does
not satisfy the triangle inequality. For $0<q\le p\le\infty$,

$$
\lVert x\rVert_p\le \lVert x\rVert_q
\quad\text{and, more precisely,}\quad
\lVert x\rVert_q\le n^{1/q-1/p}\lVert x\rVert_p.
\label{norm-comparison}
$$

<details open>
<summary>Proof of the norm comparison</summary>

The zero vector is immediate, so suppose $x\ne0$ and normalize
$y_i=|x_i|/\lVert x\rVert_q$. Then $0\le y_i\le1$ and
$\sum_i y_i^q=1$. Since $p\ge q$, $y_i^p\le y_i^q$, hence

$$
\frac{\lVert x\rVert_p^p}{\lVert x\rVert_q^p}
=\sum_i y_i^p\le\sum_i y_i^q=1.
$$

For the reverse comparison, apply Hölder to $\sum_i(|x_i|^q)\cdot1$ with
conjugate exponents $p/q$ and $p/(p-q)$. After taking the $q$th root this
gives the second inequality. Its dimension factor matters in estimates that
must scale with $n$.

</details>


## Gershgorin discs

Let $A=(a_{ij})\in\mathbb{C}^{n\times n}$. Every eigenvalue $\lambda$ of
$A$ satisfies the row-disc inclusion

$$
\lambda\in
\bigcup_{i=1}^n
\left\{z:|z-a_{ii}|\le\sum_{j\ne i}|a_{ij}|\right\},
$$

and the column-disc inclusion

$$
\lambda\in
\bigcup_{j=1}^n
\left\{z:|z-a_{jj}|\le\sum_{i\ne j}|a_{ij}|\right\}.
\label{gershgorin-discs}
$$

<details open>
<summary>Proof from <var>Ax</var> = &lambda;<var>x</var></summary>

Let $x\ne0$ be an eigenvector associated with $\lambda$. The equation
$Ax=\lambda x$ gives, for every $i$,

$$
(\lambda-a_{ii})x_i=\sum_{j\ne i}a_{ij}x_j,
$$

and therefore, by the triangle inequality,

$$
|\lambda-a_{ii}|\,|x_i|
\le\sum_{j\ne i}|a_{ij}|\,|x_j|.
\label{gershgorin-coordinate}
$$

For the row-disc bound, choose $k$ such that $|x_k|=\lVert x\rVert_\infty>0$. The $k$th coordinate of
$\eqref{gershgorin-coordinate}$ satisfies

$$
|\lambda-a_{kk}|\lVert x\rVert_\infty
\le\sum_{j\ne k}|a_{kj}|\,|x_j|
\le\left(\sum_{j\ne k}|a_{kj}|\right)\lVert x\rVert_\infty.
$$

Cancelling $\lVert x\rVert_\infty$ places $\lambda$ in the $k$th row
disc.

For the column-disc bound, sum $\eqref{gershgorin-coordinate}$ over $i$:

$$
\sum_i|\lambda-a_{ii}|\,|x_i|
\le\sum_i\sum_{j\ne i}|a_{ij}|\,|x_j|
=
\sum_j\left(\sum_{i\ne j}|a_{ij}|\right)|x_j|.
$$

If $\lambda$ were outside every column disc, then
$|\lambda-a_{jj}|>\sum_{i\ne j}|a_{ij}|$ for every $j$. Since $x\ne0$,
the left-hand side would be strictly larger than the right-hand side, a
contradiction. Thus every eigenvalue lies in both the union of the row discs and the union
of the column discs.

</details>

## Cone

A set $K\subseteq\mathbb{R}^n$ is a cone if $x\in K$ and $\theta\ge0$ imply
$\theta x\in K$. Convexity is an additional property; a cone need not be
convex unless that is stated.

For a cone $K\subseteq\mathbb{R}^n$, use the conventions

$$
K^*=\{y:\langle y,x\rangle\ge0\ \forall x\in K\},\qquad
K^\circ=\{y:\langle y,x\rangle\le0\ \forall x\in K\}.
$$

Thus $K^\circ=-K^*$.

### Bipolar theorem

If $K$ is a closed convex cone, then

$$
K^{**}=K.
$$

<details open>
<summary>Proof of the bipolar theorem</summary>

Every $x\in K$ satisfies $\langle y,x\rangle\ge0$ for every $y\in K^*$,
so $K\subseteq K^{**}$. Conversely, if $z\notin K$, the strong separation
theorem gives $y$ with $\langle y,z\rangle<0\le\langle y,x\rangle$ for every
$x\in K$. Thus $y\in K^*$ but $z\notin K^{**}$, proving the reverse inclusion.

</details>

### Normal cone

For a closed convex set $C$, the convex-analysis normal cone at $x\in C$ is

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
<details open>
<summary>Proof of the normal-cone identity</summary>

Let $y\in N_K(x)$. Taking $z=0$ gives $\langle y,x\rangle\ge0$, while taking
$z=tx$ with $t>1$ gives $(t-1)\langle y,x\rangle\le0$. Hence
$\langle y,x\rangle=0$. The defining inequality reduces to
$\langle y,z\rangle\le0$ for every $z\in K$, so
$y\in K^\circ\cap x^\perp$.

Conversely, if $y\in K^\circ\cap x^\perp$, then
$\langle y,z-x\rangle=\langle y,z\rangle\le0$ for every $z\in K$.
Therefore $y\in N_K(x)$. The polar condition is the piece missing from the
older abbreviated claim.

</details>


## Positive semidefinite matrices

A symmetric matrix $A$ is positive semidefinite, written $A\succeq0$, exactly
when $x^\top Ax\ge0$ for every $x$. Equivalent characterizations include
$A=PP^\top$ for some $P$, nonnegative eigenvalues, and nonnegative principal
minors.

<details open>
<summary>Proof of the trace criterion</summary>

For $A,B\succeq0$,

$$
AB=0\quad\Longleftrightarrow\quad\operatorname{tr}(AB)=0.
$$

The forward implication follows by taking the trace. For the reverse,
factor $A=PP^\top$ and $B=QQ^\top$. Then

$$
\operatorname{tr}(AB)
=\operatorname{tr}(P^\top QQ^\top P)
=\lVert Q^\top P\rVert_F^2\ge0.
\label{psd-trace}
$$

Notice that $\eqref{psd-trace}$ is a squared Frobenius norm, not the square of
$\operatorname{tr}(P^\top Q)$. Moreover,
$\operatorname{tr}(AB)=0$ implies $Q^\top P=0$ and therefore $AB=0$.

</details>

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

## Linear matrix inequalities and semidefinite programming

An affine LMI is $\mathcal A(x)=A_0+\sum_{i=1}^m x_iA_i\succeq0$, where the
symmetric matrices $A_i$ are data and $x$ is the decision vector. The SDP

$$
\min_x\ c^\top x\quad\text{s.t.}\quad\mathcal A(x)\succeq0
$$

has Lagrange dual

$$
\max_{Z\succeq0}\ -\langle A_0,Z\rangle
\quad\text{s.t.}\quad
\langle A_i,Z\rangle=c_i,\ i=1,\ldots,m.
$$

This restores the affine-operator formulation from the Hexo article. The
equivalent conic standard form below is useful for stating duality cleanly.

### A standard SDP primal–dual pair

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
