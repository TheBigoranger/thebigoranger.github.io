---
title: "Introducing GriD-LMIA"
date: 2026-08-28
tags: ["GriD-LMIA", "LPV", "Research Software"]
excerpt: "An introduction to GriD-LMIA, a MATLAB toolbox for constructing and certifying parameter-dependent LMIs on boxes."
---

## Why another LMI tool?

Many analysis and synthesis conditions for LPV and nonlinear systems are
parameter-dependent LMIs (PD-LMIs): a symmetric matrix inequality must hold
for every parameter value in a compact set. YALMIP is excellent at describing
a finite SDP, but the universal quantifier over a continuum still needs a
certificate.

[GriD-LMIA](https://github.com/TheBigoranger/GriD-LMIA) is a MATLAB layer for
writing those parameter-dependent expressions and replacing the continuum
condition with finite, inspectable constraints. It targets researchers who
already understand LMIs and want to compare grid and Bernstein-style
certificates without hand-assembling coefficient arrays.

Using the notation of the software paper, a general rate-dependent PD-LMI
handled by the toolbox can be written as

$$
\mathcal F(\rho,\dot\rho;y)
=F_0(\rho)
+\sum_{k=1}^{N}F_k(\rho)y_k(\rho)
-\sum_{k=1}^{N}\sum_{s=1}^{\ell}
\dot\rho_sF_{k,s}(\rho)
\frac{\partial y_k}{\partial\rho_s}(\rho)
\preceq0,\ \forall(\rho,\dot\rho)\in\mathcal P\times\mathcal R.
\label{pd-lmi-problem}
$$

Here $F_0$, $F_k$, and $F_{k,s}$ are known parameter-dependent matrix
functions, while $y_k(\rho)$ are parameter-dependent decision functions.
The parameter vector has dimension $\ell$, $N$ is the number of decision
function blocks, and $\mathcal P\times\mathcal R$ specifies the admissible
parameter and rate domain. After the $y_k$ are represented in a finite basis,
their unknown coefficients become the SDP decision variables. The difficulty
in $\eqref{pd-lmi-problem}$ is the universal quantifier shared by analysis,
synthesis, performance, and other parameter-dependent matrix inequalities.

## The modeling vocabulary

The toolbox is organized around four ideas:

- `pdvar` declares scheduling parameters and their box domains.
- `pdmat` represents matrices whose entries depend on those parameters.
- `pdlmi` stores a parameter-dependent matrix inequality before it is
  converted to finite YALMIP constraints.
- `rhodiff` differentiates a parameter-dependent expression with respect to
  the scheduling variables, which is useful when bounds on parameter rates
  enter an LPV condition.

The project keeps parameter dependence explicit until certificate selection.
That separation makes the model easier to audit: the control condition and
the relaxation used to certify it are not silently conflated.

For any parameter-dependent decision matrix $X(\rho;\theta)$, `rhodiff`
constructs its directional derivative along the scheduling trajectory:

$$
\operatorname{D}_{\rho}X(\rho;\theta)[\dot\rho]
:=\sum_{i=1}^{n_\rho}\dot\rho_i
\frac{\partial X(\rho;\theta)}{\partial\rho_i}.
\label{rate-derivative}
$$

This is why both symbolic parameter dependence and `rhodiff` matter: the
tool must construct the derivative in $\eqref{rate-derivative}$ and certify
every requested inequality in $\eqref{pd-lmi-problem}$ over the full domain.

## Minimal example

The following sketch asks for a parameter-dependent quadratic certificate on
$\rho\in[-1,1]$. Exact option names can evolve, so use the
[online documentation](https://thebigoranger.github.io/GriD-LMIA/) for the
installed release.

```matlab
yalmip('clear');
rho = pdvar('rho', [-1 1]);

A = [-1, rho; -rho, -2];
P = pdmat('P', 2, 2, rho, 2, 'symmetric');
eps0 = 1e-6;

conditions = [
    pdlmi(P - eps0*eye(2), '>=', 0), ...
    pdlmi(-(A'*P + P*A) - eps0*eye(2), '>=', 0)
];

constraints = conditions.grid('points', 21);
diagnostics = optimize(constraints, [], sdpsettings('solver', 'mosek'));
assert(diagnostics.problem == 0);
```

This is intentionally a small analysis problem. In an LPV synthesis problem,
decision substitutions and controller recovery still require the usual care;
the toolbox does not make a bilinear condition convex.

## Grid or Bernstein certificate?

<div class="certificate-flow" role="img" aria-label="A parameter-dependent LMI is modeled, converted to a finite certificate, and then solved by YALMIP and an SDP solver.">
  <div class="certificate-flow__step">
    <strong>PD-LMI model</strong>
    <span>pdmat · pdvar · rhodiff</span>
  </div>
  <div class="certificate-flow__arrow" aria-hidden="true">→</div>
  <div class="certificate-flow__step">
    <strong>Finite certificate</strong>
    <span>Grid or Bernstein conditions</span>
  </div>
  <div class="certificate-flow__arrow" aria-hidden="true">→</div>
  <div class="certificate-flow__step">
    <strong>Numerical SDP</strong>
    <span>YALMIP + selected solver</span>
  </div>
</div>

A grid certificate evaluates the matrix inequality at chosen parameter
points. It is intuitive and useful for debugging, but pointwise feasibility
alone does not certify values between points unless an additional bound or
margin argument is supplied.

A Bernstein certificate works with polynomial coefficients on a box.
Convex-hull properties can turn coefficient conditions into a sufficient
global certificate. The result may be conservative, and the number of
coefficients grows with parameter dimension and degree, but the guarantee is
continuous-domain rather than sampled.

For a polynomial matrix written in a Bernstein basis,

$$
\mathcal F(\rho)
=\sum_{\alpha}B_{\alpha}(\rho)\,\mathcal F_{\alpha},
\qquad
B_{\alpha}(\rho)\ge0,\quad
\sum_{\alpha}B_{\alpha}(\rho)=1.
\label{bernstein-expansion}
$$

The convex-hull property behind $\eqref{bernstein-expansion}$ gives the
sufficient implication

$$
\mathcal F_{\alpha}\preceq-\varepsilon I\ \ \forall\alpha
\quad\Longrightarrow\quad
\mathcal F(\rho)\preceq-\varepsilon I\ \ \forall\rho\in\mathcal P.
\label{bernstein-certificate}
$$

Condition $\eqref{bernstein-certificate}$ explains both the attraction and
the conservatism of coefficient certificates: a finite set of matrix tests
proves a continuum statement, but the sufficient coefficient condition need
not be necessary.

I generally use a grid first to find modeling errors and estimate margins,
then use a certificate appropriate to the required guarantee. A dense plot is
evidence; it is not automatically a proof.

## Installation and reproducibility

Download a tagged package from
[Releases](https://github.com/TheBigoranger/GriD-LMIA/releases), add the
toolbox to the MATLAB path, and ensure YALMIP plus a suitable SDP solver are
available. Pin the GriD-LMIA, MATLAB, YALMIP, and solver versions in
reproducible experiments. The project page on this site reports the latest
release when GitHub is reachable during the site build and falls back to a
known version when it is not.

## Scope and limitations

GriD-LMIA does not replace YALMIP or an SDP solver. It does not automatically
convexify BMI problems, eliminate certificate conservatism, or defeat the
curse of dimensionality. Its intended domain is polynomial or otherwise
supported parameter dependence on box-shaped domains. Before trusting a
result, inspect solver status, strictness margins, scaling, and the assumptions
behind the selected certificate.

## Links

- [Project overview](/project/grid-lmia)
- [Documentation](https://thebigoranger.github.io/GriD-LMIA/)
- [Source code](https://github.com/TheBigoranger/GriD-LMIA)
- [Software paper](https://arxiv.org/abs/2608.03175)
- [Tagged releases](https://github.com/TheBigoranger/GriD-LMIA/releases)
