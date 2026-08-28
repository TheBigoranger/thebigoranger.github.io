---
title: "On Dynamics"
date: 2025-05-09 14:35:46
tags: ["Dynamics", "Mechanics", "Control"]
excerpt: "A compact derivation of generalized forces, Euler–Lagrange equations, Hamiltonian form, and the manipulator equation used in control."
---

## Generalized coordinates and virtual work

Let a mechanical configuration be described by generalized coordinates
$q\in\mathbb{R}^m$, with particle positions $r_i(q,t)$. For virtual
displacements compatible with the constraints,

$$
\delta r_i=\sum_{j=1}^{m}\frac{\partial r_i}{\partial q_j}\delta q_j.
$$

The virtual work of applied forces $F_i$ is therefore
$\delta W=\sum_j Q_j\delta q_j$, where

$$
Q_j=\sum_i F_i^\top\frac{\partial r_i}{\partial q_j}.
\label{generalized-force}
$$

Equation $\eqref{generalized-force}$ is the definition of generalized force.
If $r_i$ depends on $q$ and $t$, then
$\partial \dot r_i/\partial\dot q_j=\partial r_i/\partial q_j$; this gives the
equivalent velocity-Jacobian form
$Q_j=\sum_i F_i^\top(\partial\dot r_i/\partial\dot q_j)$.

## Euler–Lagrange equations

With kinetic energy $T$ and potential energy $V$, define
$L(q,\dot q,t)=T-V$. D'Alembert's principle gives

$$
\frac{d}{dt}\left(\frac{\partial L}{\partial\dot q_j}\right)
-\frac{\partial L}{\partial q_j}=Q_j^{\mathrm{nc}},
\qquad j=1,\ldots,m,
\label{euler-lagrange}
$$

where $Q^{\mathrm{nc}}$ contains forces not represented by the chosen
potential. Conservative forces must not be counted again on the right-hand
side. Equation $\eqref{euler-lagrange}$ also remains valid for explicitly
time-dependent coordinate maps.

For a rigid-link mechanism, collecting terms yields the control-oriented
manipulator equation

$$
M(q)\ddot q+C(q,\dot q)\dot q+g(q)=\tau+d.
\label{manipulator}
$$

Here $M(q)$ is symmetric positive definite away from coordinate
singularities, $g(q)=\nabla_qV(q)$, $\tau$ is the commanded generalized force,
and $d$ collects unmodelled or external forces. The matrix $C$ is not unique;
a useful convention chooses it so that $\dot M-2C$ is skew-symmetric. Then
$\dot q^\top(\dot M-2C)\dot q=0$, which makes the kinetic-energy balance
transparent.

## Hamiltonian form

Define the canonical momentum $p=\partial L/\partial\dot q$. When the Legendre
map is nonsingular, the Hamiltonian is

$$
H(q,p,t)=p^\top\dot q-L(q,\dot q,t),
$$

with $\dot q$ expressed in terms of $(q,p,t)$. The equations of motion become

$$
\dot q=\frac{\partial H}{\partial p},\qquad
\dot p=-\frac{\partial H}{\partial q}+Q^{\mathrm{nc}}.
\label{hamilton}
$$

For a time-invariant conservative system, $H=T+V$ and
$\dot H=0$. With nonconservative generalized force, the power balance is
$\dot H=\dot q^\top Q^{\mathrm{nc}}$. This identity is often a better starting
point for passivity-based control than expanding every term in
$\eqref{manipulator}$.

## A one-link check

For a pendulum with angle $q$, mass $m$, length $\ell$, viscous damping $b$,
and input torque $\tau$,

$$
T=\frac12m\ell^2\dot q^2,\qquad
V=mg\ell(1-\cos q),\qquad
Q^{\mathrm{nc}}=\tau-b\dot q.
$$

Substitution into $\eqref{euler-lagrange}$ gives

$$
m\ell^2\ddot q+b\dot q+mg\ell\sin q=\tau.
$$

The signs can be checked from energy: without input,
$\dot H=-b\dot q^2\le 0$. This small consistency check catches many coordinate
and force-convention mistakes.

## References

- H. Goldstein, C. Poole, and J. Safko, *Classical Mechanics*, 3rd ed.,
  Addison-Wesley, 2002.
- R. M. Murray, Z. Li, and S. S. Sastry,
  [*A Mathematical Introduction to Robotic Manipulation*](https://www.cds.caltech.edu/~murray/mlswiki/),
  CRC Press, 1994.
- [MIT OpenCourseWare 8.01SC: Classical Mechanics](https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/).
