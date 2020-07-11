---
layout: page
title: Mental Models
---

A work in progress to capture the [mental models](https://fs.blog/mental-models/#what_are_mental_models) that shape my worldview.

## Systems thinking

<details><summary>Proximate vs. ultimate causes</summary>{{ '
Simple definition from [Wikipedia](https://en.wikipedia.org/wiki/Proximate_and_ultimate_causation):

> A proximate cause is an event which is closest to, or immediately responsible for causing, some observed result. This exists in contrast to a higher-level ultimate cause (or distal cause) which is usually thought of as the "real" reason something occurred. In most situations, an ultimate cause may itself be a proximate cause for a further ultimate cause.

Example from _Guns, Germs, and Steel_:

> Yet another type of explanation lists the immediate factors that enabled Europeans to kill or conquer other peoples—especially European guns, infectious diseases, steel tools, and manufactured products. Such an explanation is on the right track, as those factors demonstrably _were_ directly responsible for European conquests. However, this hypothesis is incomplete, because it still offers only a proximate (first-stage) explanation identifying immediate causes. It invites a search for ultimate causes: why were Europeans, rather than Africans or Native Americans, the ones to end up with guns, the nastiest germs, and steel?

[Farnam Street](https://fs.blog/2017/05/proximate-vs-root-causes/) goes into further detail by describing techniques for establishing and mapping ultimate causes.
' | markdownify }}</details>

<details><summary>Second Law of Thermodynamics (Law of Entropy)</summary>{{ "
Described by Steven Pinker in _Enlightenment Now_:

> The Second Law of Thermodynamics states that in an isolated system (one that is not taking in energy), entropy never decreases. (The First Law is that energy is conserved; the Third, that a temperature of absolute zero is unreachable.) Closed systems inexorably become less structured, less organized, less able to accomplish interesting and useful outcomes, until they slide into an equilibrium of gray, tepid, homogeneous monotony and stay there.

> In its original formulation the Second Law referred to the process in which usable energy in the form of a difference in temperature between two bodies is inevitably dissipated as heat flows from the warmer to the cooler body. ... A cup of coffee, unless it is placed on a plugged-in hot plate, will cool down. When the coal feeding a steam engine is used up, the cooled-off steam on one side of the piston can no longer budge it because the warmed-up steam and air on the other side are pushing back just as hard.

> How is entropy relevant to human affairs? Life and happiness depend on an infinitesimal sliver of orderly arrangements of matter amid the astronomical number of possibilities. Our bodies are improbable assemblies of molecules, and they maintain that order with the help of other improbabilities: the few substances that can nourish us, the few materials in the few shapes that can clothe us, shelter us, and move things around to our liking. Far more of the arrangements of matter found on Earth are of no worldly use to us, so when things change without a human agent directing the change, they are likely to change for the worse. The Law of Entropy is widely acknowledged in everyday life in sayings such as 'Things fall apart,' 'Rust never sleeps,' 'Shit happens,' 'Whatever can go wrong will go wrong,' and (from the Texas lawmaker Sam Rayburn) 'Any jackass can kick down a barn, but it takes a carpenter to build one.'

> Why the awe for the Second Law? From an Olympian vantage point, it defines the fate of the universe and the ultimate purpose of life, mind, and human striving: to deploy energy and knowledge to fight back the tide of entropy and carve out refuges of beneficial order.

> ... _misfortune may be no one's fault_. A major breakthrough of the Scientific Revolution—perhaps its biggest breakthrough—was to refute the intuition that the universe is saturated with purpose. In this primitive but ubiquitous understanding, everything happens for a reason, so when bad things happen—accidents, disease, famine, poverty—some agent must have _wanted_ them to happen. ... Galileo, Newton, and Laplace replaced this cosmic morality play with a clockwork universe in which events are caused by conditions in the present, not goals for the future. _People_ have goals, of course, but projecting goals onto the workings of nature is an illusion. Things can happen without anyone taking into account their effects on human happiness.
" | markdownify }}</details>

## History

<details><summary>Theories of history</summary>{{ "
Explained in both [essay](https://medium.com/@samo.burja/on-building-theories-of-history-36ed1999216e) and [video](https://www.youtube.com/watch?v=jKdv2CqM1o0) formats by [Samo Burja](http://samoburja.com/):

> Everyone has an implicit theory of history-- usually inconsistent across time periods and typically incoherent without explication and conscious work, it will nonetheless be the basis of much of your action in the world. Most people never discover theirs simply because they don't realize they're acting on one. Now that you have the concept-- what is yours?
" | markdownify }}</details>

### Timeline
An (incomplete) loose collection of historic events that have significantly shaped today’s social institutions, inconsistent and incoherent as per "Theories of history" above.
<link title="timeline-styles" rel="stylesheet" href="timeline.css">
<script src="timeline.js"></script>
<div id='timeline-embed' style="width: 100%; height: 600px"></div>
<script type="text/javascript">
var options = {
  use_bc: true,
  slide_padding_lr: 0
}
timeline = new TL.Timeline('timeline-embed', 'timeline.json', options);
</script>