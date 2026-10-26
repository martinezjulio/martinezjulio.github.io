---
layout: page
title: Measuring and Modeling Physical Intrinsic Motivation
description: What makes a physical event interesting to watch? We collected human interestingness ratings on simulated physics videos and tested which intrinsic-reward functions predict them.
date: 2023-05-22
img: assets/img/physical-intrinsic-motivation/thumb.jpg
og_image: https://martinezjulio.com/assets/img/physical-intrinsic-motivation/thumb.jpg
category: research
related_publications: true
_styles: >
  .project-authors { margin-bottom: 0.75rem; }
  .project-links { margin: 0 0 1.5rem; }
  .project-links a.btn {
    color: var(--global-text-color);
    border: 1px solid var(--global-text-color);
    padding: 0.25rem 0.75rem;
    margin: 0 0.5rem 0.5rem 0;
    font-size: 0.8rem;
    text-decoration: none;
  }
  .project-links a.btn:hover {
    color: var(--global-theme-color);
    border-color: var(--global-theme-color);
  }
---

{% assign v = '/assets/video/physical-intrinsic-motivation' %}

<p class="project-authors">
  <strong>Julio Martinez</strong><sup>1,*</sup>, Felix Binder<sup>2</sup>, Haoliang Wang<sup>3</sup>, Nick Haber<sup>4,5</sup>, Judith Fan<sup>1,3</sup>, Daniel L. K. Yamins<sup>1,5</sup>
  <br>
  <small>
    <sup>1</sup>Department of Psychology, Stanford University &middot;
    <sup>2</sup>Department of Cognitive Science, UC San Diego &middot;
    <sup>3</sup>Department of Psychology, UC San Diego &middot;
    <sup>4</sup>Graduate School of Education, Stanford University &middot;
    <sup>5</sup>Department of Computer Science, Stanford University
  </small>
  <br>
  <small><em>Proceedings of the 45th Annual Meeting of the Cognitive Science Society</em> (CogSci 2023)</small>
</p>

<div class="project-links">
  <a class="btn btn-sm z-depth-0" href="https://arxiv.org/abs/2305.13452" target="_blank" rel="external nofollow noopener" role="button">arXiv</a>
  <a class="btn btn-sm z-depth-0" href="https://arxiv.org/pdf/2305.13452" target="_blank" rel="external nofollow noopener" role="button">PDF</a>
  <a class="btn btn-sm z-depth-0" href="https://scholar.google.com/citations?view_op=view_citation&hl=en&user=S77dKjIAAAAJ&citation_for_view=S77dKjIAAAAJ:roLk4NBRz8UC" target="_blank" rel="external nofollow noopener" role="button">Google Scholar</a>
  <a class="btn btn-sm z-depth-0" href="#martinez2023measuring" role="button">BibTeX</a>
</div>

<figure>
  <video class="img-fluid rounded z-depth-1" src="{{ v | append: '/scenarios.mp4' | relative_url }}" poster="{{ v | append: '/scenarios.jpg' | relative_url }}" width="100%" autoplay loop muted playsinline preload="metadata"></video>
  <figcaption class="caption">The eight physical scenarios from the Physion benchmark that participants rated: Dominoes, Support, Collide, Contain, Drop, Link, Roll, and Drape.</figcaption>
</figure>

## The question

From infancy, people are drawn to explore their physical surroundings and to play with the objects in them. That exploration is not random. Curiosity has long been described as an intrinsic motivation that closes gaps in knowledge, and children prefer stimuli whose outcomes are neither fully predictable nor fully unpredictable. We wanted to formalize this drive for the physical world: what is the <em>intrinsic reward function</em> (IRF) that directs a person toward some physical events and away from others?

Our approach was to treat "interestingness" as a proxy for intrinsic reward. We asked people how interesting they found short videos of physical events, then asked which candidate reward functions, computed from the same videos, best predicted those judgments {% cite martinez2023measuring %}.

<div class="row justify-content-sm-center">
  <div class="col-sm-12 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/physical-intrinsic-motivation/figure1.png" class="img-fluid rounded z-depth-1" zoomable=true alt="Theoretical framework for an intrinsically motivated agent and the hypothesis space of intrinsic reward functions" %}
  </div>
</div>
<div class="caption">
  <strong>Framework.</strong> (a) An intrinsically motivated agent acts in a simulated environment, uses a world model (WM) to predict physical dynamics forward in time, and chooses actions with a policy model that optimizes an intrinsic reward produced by an IRF. (b) Candidate IRFs lie on a continuum: simple scene features on the left, and functions that increasingly aim to improve the world model toward the right.
</div>

## Stimuli and task

We repurposed the <a href="https://physion-benchmark.github.io/" target="_blank" rel="external nofollow noopener">Physion</a> benchmark, a set of 3D videos simulated in ThreeDWorld that span rigid and soft-body dynamics across eight scenario types. Physion was built to measure physical prediction accuracy. We changed the question: instead of asking what will happen, we asked how interesting the event was.

<div class="row">
  <div class="col-sm-4 mt-3 mt-md-0">
    <video class="img-fluid rounded z-depth-1" src="{{ v | append: '/stimuli-collide.mp4' | relative_url }}" poster="{{ v | append: '/stimuli-collide.jpg' | relative_url }}" width="100%" autoplay loop muted playsinline preload="metadata"></video>
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    <video class="img-fluid rounded z-depth-1" src="{{ v | append: '/stimuli-drop.mp4' | relative_url }}" poster="{{ v | append: '/stimuli-drop.jpg' | relative_url }}" width="100%" autoplay loop muted playsinline preload="metadata"></video>
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    <video class="img-fluid rounded z-depth-1" src="{{ v | append: '/stimuli-support.mp4' | relative_url }}" poster="{{ v | append: '/stimuli-support.jpg' | relative_url }}" width="100%" autoplay loop muted playsinline preload="metadata"></video>
  </div>
</div>
<div class="caption">
  Samples of the Collide, Drop, and Support stimuli. Each scenario has 2,000 training videos used to train the world models and 150 test videos that participants rated.
</div>

We recruited 1,800 participants on Prolific. Each watched the 150 test videos of one scenario in random order. A trial began with a fixation cross, showed the first frame of the video for two seconds, played the video, and then asked for a rating from 1 (least interesting) to 5 (most interesting). Each video received about 32 ratings. Mean ratings were highly reliable: the split-half reliability, averaged across scenarios, was 0.935.

<div class="row justify-content-sm-center">
  <div class="col-sm-12 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/physical-intrinsic-motivation/figure2.png" class="img-fluid rounded z-depth-1" zoomable=true alt="Stimuli, task procedure, reliability, and modeling pipeline" %}
  </div>
</div>
<div class="caption">
  <strong>Stimuli, task, and pipeline.</strong> (a) Examples of the eight scenarios. (b) The rating task. (c) Split-half reliability of mean ratings per scenario. (d) The same videos go to participants and to each candidate IRF; a model's score is its correlation with mean human ratings.
</div>

## Candidate reward functions

We compared two families of intrinsic reward functions.

**Simple scene features** need no world model. They are statistics that can be read off the scene directly: object positions and velocities, their variances, the number of objects and object categories, the number of static distractors, and the number of collisions.

**World-model-based functions** depend on a learned physics predictor. We used <a href="https://arxiv.org/abs/1810.01566" target="_blank" rel="external nofollow noopener">DPINet</a>, a particle-based graph neural network whose Physion accuracy is the closest to human accuracy among the models tested, pretrained on the Physion training set. On top of it we implemented four classic IRFs from the curiosity literature:

- **Novelty (RND).** Random network distillation: reward is how poorly a trained predictor matches a fixed random network's embedding of the current state, so unfamiliar states score high.
- **Adversarial.** Reward equals the world model's prediction error on a k-step rollout. Events the model gets wrong are rewarding.
- **Disagreement.** Reward is the variance across an ensemble of world models' predictions. Events the models cannot agree on are rewarding.
- **δ-Progress.** Reward is how much the world model's error dropped between an older and a newer checkpoint. Events the model is learning about are rewarding.

<div class="row">
  <div class="col-sm-6 mt-3 mt-md-0">
    <video class="img-fluid rounded z-depth-1" src="{{ v | append: '/particles-dominoes.mp4' | relative_url }}" poster="{{ v | append: '/particles-dominoes.jpg' | relative_url }}" width="100%" autoplay loop muted playsinline preload="metadata"></video>
  </div>
  <div class="col-sm-6 mt-3 mt-md-0">
    <video class="img-fluid rounded z-depth-1" src="{{ v | append: '/particles-contain.mp4' | relative_url }}" poster="{{ v | append: '/particles-contain.jpg' | relative_url }}" width="100%" autoplay loop muted playsinline preload="metadata"></video>
  </div>
</div>
<div class="row">
  <div class="col-sm-6 mt-3">
    <video class="img-fluid rounded z-depth-1" src="{{ v | append: '/particles-roll.mp4' | relative_url }}" poster="{{ v | append: '/particles-roll.jpg' | relative_url }}" width="100%" autoplay loop muted playsinline preload="metadata"></video>
  </div>
  <div class="col-sm-6 mt-3">
    <video class="img-fluid rounded z-depth-1" src="{{ v | append: '/particles-drape.mp4' | relative_url }}" poster="{{ v | append: '/particles-drape.jpg' | relative_url }}" width="100%" autoplay loop muted playsinline preload="metadata"></video>
  </div>
</div>
<div class="caption">
  What the world model sees. We bypass perception and give DPINet an explicit state: every object as a cloud of particles with positions and velocities. Shown here for Dominoes, Contain, Roll, and Drape.
</div>

Rather than compare human free-play actions with an agent's actions, which would require also committing to a policy model, we computed each IRF's total reward directly on the rated videos and correlated it with mean human ratings. World-model-based rewards were computed at several DPINet training checkpoints and for one- to four-step rollouts. Composite models were fit with L1-regularized linear regression on 80/20 splits of the stimuli.

## What people found interesting

<div class="row">
  <div class="col-sm-6 mt-3 mt-md-0">
    <video class="img-fluid rounded z-depth-1" src="{{ v | append: '/dominoes-most.mp4' | relative_url }}" poster="{{ v | append: '/dominoes-most.jpg' | relative_url }}" width="100%" autoplay loop muted playsinline preload="metadata"></video>
  </div>
  <div class="col-sm-6 mt-3 mt-md-0">
    <video class="img-fluid rounded z-depth-1" src="{{ v | append: '/dominoes-least.mp4' | relative_url }}" poster="{{ v | append: '/dominoes-least.jpg' | relative_url }}" width="100%" autoplay loop muted playsinline preload="metadata"></video>
  </div>
</div>
<div class="caption">
  Dominoes: the video rated most interesting (left) and the one rated least interesting (right).
</div>
<div class="row">
  <div class="col-sm-6 mt-3">
    <video class="img-fluid rounded z-depth-1" src="{{ v | append: '/collide-most.mp4' | relative_url }}" poster="{{ v | append: '/collide-most.jpg' | relative_url }}" width="100%" autoplay loop muted playsinline preload="metadata"></video>
  </div>
  <div class="col-sm-6 mt-3">
    <video class="img-fluid rounded z-depth-1" src="{{ v | append: '/collide-least.mp4' | relative_url }}" poster="{{ v | append: '/collide-least.jpg' | relative_url }}" width="100%" autoplay loop muted playsinline preload="metadata"></video>
  </div>
</div>
<div class="caption">
  Collide: one of the highest-rated videos (left) and the lowest-rated video (right).
</div>

## Results

**World-model-based rewards explain human ratings better than scene features, and adversarial reward does best.** Several scene features were indistinguishable from zero. Three of the four best single predictors were world-model-based. Adversarial reward, the world model's own prediction error, had the highest cross-scenario correlation with human ratings, r = 0.36.

<div class="row justify-content-sm-center">
  <div class="col-sm-12 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/physical-intrinsic-motivation/figure3.svg" class="img-fluid rounded z-depth-1" zoomable=true alt="Correlations of individual intrinsic reward functions with human ratings, and their stability across training steps and rollout lengths" %}
  </div>
</div>
<div class="caption">
  <strong>Single-model results.</strong> (a) Correlation of each IRF with mean human ratings; the dashed line is the noise ceiling. (b) World-model-based rewards are stable across rollout length and, after about 100k training steps, across training. δ-Progress is the exception: its correlation flips sign over training, so (a) shows it at two checkpoints.
</div>

**Scene features do not generalize across scenarios; world-model rewards do.** Linearly combining all scene features raises the overall correlation but makes Drop and Drape worse, because the sign of a feature's relationship to interestingness flips from scenario to scenario. Every world-model-based reward keeps the same sign in every scenario.

<div class="row justify-content-sm-center">
  <div class="col-sm-12 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/physical-intrinsic-motivation/figure4.svg" class="img-fluid rounded z-depth-1" zoomable=true alt="Composite model results across scenarios" %}
  </div>
</div>
<div class="caption">
  <strong>Composite models.</strong> Left: all scene features combined. Center: all world-model-based rewards plus RND. Right: adversarial reward plus the number of collisions. Dots above each column mark the per-scenario noise ceiling.
</div>

**Everything is still far below the noise ceiling.** Human ratings agree with each other at 0.935; the best model reaches 0.36. There is a lot of structure in what people find interesting that none of these reward functions capture yet.

**Adversarial reward and collision count are complementary.** Of all two-feature combinations with adversarial reward, adding the raw number of collisions improved predictions the most.

<div class="row justify-content-sm-center">
  <div class="col-sm-12 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/physical-intrinsic-motivation/figure5.png" class="img-fluid rounded z-depth-1" zoomable=true alt="Per-scenario correlation signs for each reward function, and gains from pairing adversarial reward with each other feature" %}
  </div>
</div>
<div class="caption">
  <strong>Generalization and complementarity.</strong> Bottom: the sign of each IRF's correlation in each scenario. All-green columns generalize; mixed columns do not. Top: predictive accuracy when adversarial reward is paired with each other feature, ordered by gain.
</div>

## Two motives

<div class="row">
  <div class="col-sm-6 mt-3 mt-md-0">
    <video class="img-fluid rounded z-depth-1" src="{{ v | append: '/adversarial-high.mp4' | relative_url }}" poster="{{ v | append: '/adversarial-high.jpg' | relative_url }}" width="100%" autoplay loop muted playsinline preload="metadata"></video>
  </div>
  <div class="col-sm-6 mt-3 mt-md-0">
    <video class="img-fluid rounded z-depth-1" src="{{ v | append: '/collisions-high.mp4' | relative_url }}" poster="{{ v | append: '/collisions-high.jpg' | relative_url }}" width="100%" autoplay loop muted playsinline preload="metadata"></video>
  </div>
</div>
<div class="caption">
  Two highly rated videos, interesting for different reasons. Left: high adversarial reward with few collisions, an outcome the world model did not predict. Right: many collisions with low adversarial reward, a lot happening but nothing surprising.
</div>

The results point to two components of physical intrinsic motivation. People are drawn to events that are hard to predict, which is what adversarial reward measures and what an information-seeking account expects. People are also drawn to events where a lot happens, which collision count captures and prediction error does not. Dominoes make this vivid: a long chain of collisions is fun to watch even when every fall is foreseeable.

Whether this split reflects something fundamental about curiosity or an artifact of rating passive videos rather than interacting with a scene is an open question. Either way, the gap to the noise ceiling says there is a better reward function to find, and the generalization results say it should be built on a world model.

## Acknowledgments

This work was supported by Simons Foundation grant 543061, National Science Foundation CAREER grant 1844724, Office of Naval Research grant S5122, and the Stanford Human-Centered Artificial Intelligence Inaugural Fellowship.
