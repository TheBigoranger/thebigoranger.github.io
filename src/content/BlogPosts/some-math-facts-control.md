---
title: "Some Math Facts Behind Control Theory"
date: 2025-01-22 14:54:26
tags: ["Control Theory", "Stability", "Lyapunov"]
excerpt: "Continuous- and discrete-time Lyapunov tests, matrix exponentials, and spectral mappings with corrected quantifiers and matrix ordering."
---

## Continuous-time Lyapunov stability

A real square matrix $A$ is Hurwitz if every eigenvalue has negative real
part.

#### Lyapunov inequality

The first Lyapunov theorem is

$$
A\ \text{is Hurwitz}
\quad\Longleftrightarrow\quad
\exists P\succ0:\ A^\top P+PA\prec0.
\label{ct-lyapunov-inequality}
$$

The condition is an LMI in $P$. The original Hexo note gave both a trajectory
argument and a Jordan-form construction; both are retained below.

<details open>
<summary>Proof of the continuous-time Lyapunov inequality</summary>

<details>
<summary>Inequality implies Hurwitz stability</summary>

For $\dot x=Ax$ and $V(x)=x^\top Px$,
$\dot V=x^\top(A^\top P+PA)x$. Since both $P$ and
$-(A^\top P+PA)$ are positive definite, there is an $\alpha>0$ such that
$\dot V\le-\alpha V$. Therefore
$V(x(t))\le e^{-\alpha t}V(x(0))$, so every trajectory decays
exponentially and $A$ must be Hurwitz.

Equivalently, if $A$ were not Hurwitz there would be at least one nonzero
real invariant direction, or a real subspace associated with a complex
eigenpair, that did not decay. The older sentence claiming this for *every*
nonzero initial state was too strong; the existence of one such direction is
the contradiction needed here.

</details>

<details>
<summary>Hurwitz stability implies the inequality: Jordan construction</summary>

Let $A=SJS^{-1}$ be a real Jordan decomposition and set
$P=S^{-\top}\widehat P S^{-1}$. Congruence reduces the problem to choosing
$\widehat P\succ0$ so that

$$
J^\top\widehat P+\widehat P J\prec0.
\label{ct-jordan-inequality}
$$

Choose $\widehat P$ block diagonal, conforming to the real Jordan blocks.
For a real block $J_\lambda=\lambda I+N$ with $\lambda<0$, take
$D=\operatorname{diag}(p_1,\ldots,p_r)$. Then
$-(J_\lambda^\top D+DJ_\lambda)$ is tridiagonal: its diagonal entries are
$-2\lambda p_i>0$ and its adjacent entries are $-p_i$. For a block of size
two,

$$
\begin{bmatrix}-2\lambda p_1&-p_1\\-p_1&-2\lambda p_2\end{bmatrix}\succ0
\quad\Longleftrightarrow\quad
0<p_1<4\lambda^2p_2.
$$

For a longer chain, first choose the trailing positive block and then choose
$p_1>0$ sufficiently small. Its Schur complement remains positive. Repeating
this finite induction constructs all $p_i$.

For a conjugate eigenpair $a\pm ib$ with $a<0$, a real Jordan block has
$R=\begin{bmatrix}a&b\\-b&a\end{bmatrix}$ on its diagonal and $I_2$ on its
superdiagonal. Take
$D=\operatorname{diag}(p_1I_2,\ldots,p_rI_2)$. Because
$R^\top+R=2aI_2$, the same Schur-complement induction applies with $a$ in
place of $\lambda$. Permuting odd and even coordinates exposes the two
identical scalar chains described in the original proof. Combining the
blocks proves $\eqref{ct-jordan-inequality}$ and hence the theorem.

</details>
</details>

#### Lyapunov equation

The equation form strengthens the certificate: for every prescribed
$Q\succ0$, there is a unique $P\succ0$. It states

$$
A\ \text{is Hurwitz}
\quad\Longleftrightarrow\quad
\forall Q\succ0,\ \exists!\ P\succ0:
A^\top P+PA=-Q.
\label{ct-lyapunov}
$$

<details open>
<summary>Proof of the continuous-time Lyapunov theorem</summary>

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

<details>
<summary>Converse direction</summary>

Conversely, suppose $P\succ0$ and $A^\top P+PA\prec0$. If $A$ were not
Hurwitz, there would exist a nonzero (possibly complex) initial direction
whose trajectory does not converge exponentially to zero. It is not true
that *every* nonzero initial condition must fail to converge. The quadratic
Lyapunov inequality nevertheless implies uniform exponential decay for all
real initial conditions, giving the contradiction.

</details>

If $P_1$ and $P_2$ solve the same equation, their difference $D$ satisfies
$A^\top D+DA=0$. Hence $e^{A^\top t}De^{At}=D$ for every $t$, while the
left side tends to zero because $A$ is Hurwitz. Therefore $D=0$, proving
uniqueness.
</details>

## Discrete-time Lyapunov stability

A matrix $F$ is Schur stable when $\rho(F)<1$.

#### Lyapunov inequality

The discrete-time inequality theorem is

$$
F\ \text{is Schur}
\quad\Longleftrightarrow\quad
\exists P\succ0:\ P-F^\top PF\succ0.
\label{dt-lyapunov-inequality}
$$

<details open>
<summary>Proof of the discrete-time Lyapunov inequality</summary>

<details>
<summary>Inequality implies Schur stability</summary>

For $x_{k+1}=Fx_k$ and $V_k=x_k^\top Px_k$,

$$
V_k-V_{k+1}=x_k^\top(P-F^\top PF)x_k\ge\alpha V_k
$$

for some $0<\alpha<1$. Hence
$V_k\le(1-\alpha)^kV_0$ and every state tends to zero. If $F$ had an
eigenvalue of modulus at least one, at least one real invariant direction or
real subspace would fail to decay, giving a contradiction. Again, the needed
quantifier is “there exists a nondecaying initial direction,” not “every
nonzero initial condition.”

</details>

<details>
<summary>Schur stability implies the inequality: complex Jordan construction</summary>

Let $F=SJS^{-1}$ over $\mathbb C$ and seek
$P=S^{-H}\widehat P S^{-1}$, where $H$ denotes conjugate transpose. It is
enough to construct a positive Hermitian block $D$ for each Jordan block
$J_\lambda=\lambda I+N$, $|\lambda|<1$, such that
$D-J_\lambda^HDJ_\lambda\succ0$.

For $D=\operatorname{diag}(p_1,\ldots,p_r)$ and
$\delta=1-|\lambda|^2>0$, the matrix is tridiagonal. Its first diagonal
entry is $\delta p_1$, the later ones are
$\delta p_i-p_{i-1}$, and the adjacent entries are
$-\overline\lambda p_i$ and $-\lambda p_i$. For $r=2$ this is

$$
\begin{bmatrix}
\delta p_1&-\overline\lambda p_1\\
-\lambda p_1&\delta p_2-p_1
\end{bmatrix}\succ0
\quad\Longleftrightarrow\quad
0<p_1<\delta^2p_2.
$$

For $r>2$, choose a positive trailing block and then take $p_1>0$
sufficiently small; the Schur complement stays positive. Finite induction
constructs the whole block. When $\lambda=0$, the same recursion handles the
nilpotent superdiagonal—the block is not simply the zero matrix when
$r>1$. Pairing conjugate blocks yields a real positive-definite $P$ for real
$F$. This retains the original induction while correcting its displayed
Jordan-block entries.

</details>
</details>

#### Lyapunov equation

As in continuous time, prescribing any $Q\succ0$ gives the stronger theorem

$$
F\ \text{is Schur}
\quad\Longleftrightarrow\quad
\forall Q\succ0,\ \exists!\ P\succ0:
F^\top PF-P=-Q.
\label{dt-lyapunov}
$$

<details open>
<summary>Proof of the discrete-time Lyapunov theorem</summary>

When $F$ is Schur,

$$
P=\sum_{k=0}^{\infty}(F^\top)^kQF^k
\label{dt-series}
$$

is convergent and satisfies $\eqref{dt-lyapunov}$ by telescoping. This is the
discrete analogue of $\eqref{ct-integral}$.

<details>
<summary>Converse direction</summary>

If $P-F^\top PF=Q\succ0$, the discrete Lyapunov inequality already proved
that $F$ is Schur. This is the immediate implication recorded in the Hexo
proof.

</details>

For uniqueness, let two solutions differ by $D$. Then
$D=F^\top DF=(F^\top)^kDF^k$ for every $k$. Since $F$ is Schur, the right
side tends to zero and $D=0$. In the series calculation, the second sum is
$\sum_{k=0}^\infty(F^\top)^{k+1}QF^{k+1}$; matching both exponents is what
makes the terms telescope.

</details>

## Relation between continuous- and discrete-time stability

### Sampling and the matrix exponential

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

<details>
<summary>Approximate the left half-plane with a large circle</summary>

The eigenvalues of $M$ lie in the disk
$D(c,r)=\{z:|z-c|<r\}$ exactly when $(M-cI)/r$ is Schur, equivalently when
some $P\succ0$ satisfies

$$
r^2P-(M-cI)^\top P(M-cI)\succ0.
$$

The disks $D(-\varepsilon,\varepsilon)$ fill the open left half-plane as
$\varepsilon\to\infty$. Substituting $c=-\varepsilon$, $r=\varepsilon$ gives

$$
\varepsilon^2P-(B+\varepsilon I)^\top P(B+\varepsilon I)\succ0
\quad\Longleftrightarrow\quad
B^\top P+PB\prec-\varepsilon^{-1}B^\top PB.
$$

The sign is important: the disk is centered at $-\varepsilon$, not
$+\varepsilon$. In the limit this becomes the continuous-time Lyapunov
inequality.

</details>

<details>
<summary>Recover the infinitesimal inequality from the matrix exponential</summary>

Exact spectral mapping shows that $e^{Bt}$ is Schur for every $t>0$ whenever
$B$ is Hurwitz. For a fixed $P$, the expansion

$$
P-e^{B^\top t}Pe^{Bt}=-t(B^\top P+PB)+o(t)
$$

shows that if the discrete inequality holds with this same $P$ for a sequence
$t\downarrow0$, then $B^\top P+PB\preceq0$; strictness follows when a uniform
first-order margin is present. Conversely, a strict continuous inequality
gives

$$
P-e^{B^\top t}Pe^{Bt}
=-\int_0^t e^{B^\top s}(B^\top P+PB)e^{Bs}\,ds\succ0
$$

for every $t>0$. This separates the exact stability statement—which has no
small-$t$ restriction—from the Taylor argument, which does take $t\to0$.

</details>

<details>
<summary>Euler approximation</summary>

Replacing $e^{Bt}$ by $I+tB$ gives the exact identity

$$
(I+tB)^\top P(I+tB)-P
=t(B^\top P+PB)+t^2B^\top PB.
$$

If $B^\top P+PB\prec0$, the negative first-order term dominates for all
sufficiently small positive $t$, so $I+tB$ satisfies a discrete Lyapunov
inequality. This is a numerical approximation, unlike exact sampling by
$e^{Bt}$.

</details>

### Cayley transforms

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
<details>
<summary>From the left half-plane to the unit disk</summary>

For $z\in\mathbb C$ with $\operatorname{Re}z<0$,

$$
\left|\frac{1+z}{1-z}\right|^2
=\frac{1+2\operatorname{Re}z+|z|^2}
{1-2\operatorname{Re}z+|z|^2}<1.
$$

Thus the Möbius map sends the open left half-plane to the open unit disk.
Substituting $F=(I+A)(I-A)^{-1}$ into the discrete inequality and applying a
congruence by $I-A$ gives

$$
\begin{aligned}
&(I-A)^\top P(I-A)-(I+A)^\top P(I+A)\\
&\qquad=-2(A^\top P+PA)\succ0,
\end{aligned}
$$

which is exactly the continuous-time Lyapunov inequality.

</details>

<details>
<summary>Matrix logarithm viewpoint and its limitation</summary>

If an invertible Schur matrix $F$ has a chosen complex logarithm, then
$A=T_s^{-1}\log F$ satisfies $e^{AT_s}=F$, and every logarithm eigenvalue has
negative real part because $|\lambda(F)|<1$. This embeds the discrete system
in a stable continuous flow.

This is not a universal real-matrix proof. A singular Schur matrix has no
matrix logarithm at all, and a real logarithm has additional parity
conditions on Jordan blocks associated with negative real eigenvalues.
Those exceptions invalidate the original claim that every real Schur matrix
always has a real logarithm, though the viewpoint remains useful whenever
the stated hypotheses hold.

</details>

<details>
<summary>From the unit disk back to the left half-plane</summary>

For $|z|<1$,

$$
2\operatorname{Re}\frac{z-1}{z+1}
=\frac{2(|z|^2-1)}{|z+1|^2}<0.
$$

Since a Schur matrix cannot have the boundary eigenvalue $-1$, $F+I$ is
invertible and $A=(F-I)(F+I)^{-1}$ is Hurwitz. Moreover,

$$
\begin{aligned}
A^\top P+PA
&=(F+I)^{-\top}\big[(F-I)^\top P(F+I)\\
&\qquad +(F+I)^\top P(F-I)\big](F+I)^{-1}\\
&=2(F+I)^{-\top}(F^\top PF-P)(F+I)^{-1}.
\end{aligned}
$$

Therefore $F^\top PF-P\prec0$ implies $A^\top P+PA\prec0$. This is the
inverse of the preceding Cayley calculation; the corrected signs can be
checked with $z=-1$, which maps to zero in the forward direction.

</details>

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
