---
layout: post
title: Global Issue Interconnections
tag: systems thinking
---

## Summary

There is no shortage of pressing problems in the world, enumerated by [the United Nations](https://www.un.org/en/global-issues) (and respective [Sustainable Development Goals](https://sdgs.un.org/goals)), [World Economic Forum](https://www.weforum.org/reports/global-risks-report-2023), [80,000 hours](https://80000hours.org/problem-profiles/), etc. These issues are highly interconnected, and making meaningful progress on one often requires domain knowledge on another. This is my attempt to map out those interdependencies and identify outsized areas of impact (w.r.t. problem prioritization, but also to identify fundamental topics/domains that one should learn about that are important to many systemic issues).

Takeaways include:
- Geopolitics, social unrest, the economy, and strong institutions are foundational to most issues. It's difficult to make progress on an issue if one of these areas is in a poor state, so understanding general trends in them is important.
- Strategically prioritizing problems is important for effectiveness and efficiency, and priority is situational e.g. per country.
- Prioritizing basic and secondary needs (strong institutions, extreme poverty, access to essential services, gender equality, and governance) are perceived as more important than tackling higher-level systemic issues (e.g. climate change, urbanization).
- The Sustainable Development Goals typically synergize with one another (where success in one promotes success in the other), rather than posing trade-offs (where success in one comes at the cost of success in the other).
- None of the Sustainable Development Goals are fundamentally incompatible with another, but some have trade-offs that warrant careful consideration to support economic and social development within environmental limits.

## My attempt at synthesis

Below is my basic attempt to draw connections between UN Global Issues. It was developed from reading summaries of each issue (supplemented by [A Guide to SDG Interactions: from Science to Implementation](https://council.science/publications/a-guide-to-sdg-interactions-from-science-to-implementation/)), and noting challenges that block its progress, adjacent issues that will also benefit from its progress, or related topics that are necessary to understand it. It's a superficial overview that lacks weighted importance between connections, and some issues are more thorough in drawing sub-issues and connections than others, but it provides a decent enough overview to understand systemic interactions.

An edge (arrow) from A → B indicates either A's causality to B, or A's importance in B's solution. Nodes are sized based on how many _outgoing_ edges they have, i.e. how causal or important they are to other issues. The original UN Global Issues are marked with a "UN" icon.

<script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>

<style type="text/css">
    #mynetwork {
        width: 75vw;
        height: 75vh;
        position: relative;
        left: 25%;
        right: 25%;
        margin-left: -25vw;
        margin-right: -25vw;
        border: 1px solid lightgray;
    }
</style>

<body>
<div id="mynetwork"></div>
<script type="text/javascript">
    var nodes = new vis.DataSet([
        // define nodes for UN issues
        {% assign un_icon = site.static_files | where: "name", "UN_icon.png" | map: "path" | first %}
        {id: 'africa', label: 'Africa', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'ageing', label: 'Ageing', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'aids', label: 'AIDS', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'atomic_energy', label: 'Atomic Energy', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'big_data', label: 'Big Data for Sustainable Development', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'children', label: 'Children', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'climate', label: 'Climate Change', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'decolonization', label: 'Decolonization', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'democracy', label: 'Democracy', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'disarmament', label: 'Disarmament', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'poverty', label: 'Poverty', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'food', label: 'Food', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'gender_eq', label: 'Gender Equality', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'health', label: 'Health', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'human_rights', label: 'Human Rights', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'international_law', label: 'International Law and Justice', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'migration', label: 'Migration', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'oceans', label: 'Oceans and the Law of the Sea', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'peace', label: 'Peace and Security', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'population', label: 'Population', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'refugees', label: 'Refugees', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'water', label: 'Water', shape: 'circularImage', image: '{{un_icon}}'},
        {id: 'youth', label: 'Youth', shape: 'circularImage', image: '{{un_icon}}'},
        
        // define nodes for sub-issues
        {id: 'econ_dev', label: 'Economic development'},
        {id: 'education', label: 'Education'},
        {id: 'diseases', label: 'Preventing and controlling both communicable and noncommunicable diseases'},
        {id: 'corruption', label: 'Corruption'},
        {id: 'fertility', label: 'Fertility'},
        {id: 'mortality', label: 'Mortality'},
        {id: 'nuclear', label: 'Nuclear safety and terrorism'},
        {id: 'privacy', label: 'Privacy'},
        {id: 'new_data', label: 'New data sources'},
        {id: 'inequality', label: 'Inequality'},
        {id: 'public_private', label: 'Public/private partnerships'},
        {id: 'abuse', label: 'Physical, mental, sexual abuse'},
        {id: 'energy', label: 'Energy'},
        {id: 'agriculture', label: 'Agriculture'},
        {id: 'state_building', label: 'State-building (institutions)'},
        {id: 'nation_building', label: 'Nation-building (loyalty)'},
        {id: 'language', label: 'Language policy'},
        {id: 'media', label: 'Mass media'},
        {id: 'elections', label: 'Elections'},
        {id: 'freedom', label: 'Freedom'},
        {id: 'human_dev', label: 'Human development'},
        {id: 'nuclear_energy', label: 'Nuclear energy'},
        {id: 'dev_nations', label: 'Developing nations'},
        {id: 'employment', label: 'Employment'},
        {id: 'crime', label: 'Crime'},
        {id: 'housing', label: 'Housing'},
        {id: 'service_access', label: 'Access to basic services'},
        {id: 'tax_havens', label: 'Tax havens'},
        {id: 'debt', label: '(State) debt'},
        {id: 'human_capital', label: 'Human capital flight'},
        {id: 'social_integration', label: 'Social integration'},
        {id: 'regional_conflict', label: 'Regional conflict'},
        {id: 'supply_chain', label: 'Supply chain'},
        {id: 'local_farming', label: 'Local small-scale production'},
        {id: 'econ_policy', label: 'Economic policy'},
        {id: 'welfare', label: 'Social safety net'},
        {id: 'food_waste', label: 'Food waste'},
        {id: 'gmos', label: 'GMOs'},
        {id: 'eq_opp', label: 'Equal opportunity'},
        {id: 'culture', label: 'Culture and tradition'},
        {id: 'reproductive', label: 'Reproductive rights'},
        {id: 'property', label: 'Rights to ownership and control of property'},
        {id: 'women_rights', label: 'Rights to inheritance, child custody, and loss of nationality'},
        {id: 'deep_legal_legislative', label: 'Deep legal and legislative changes'},
        {id: 'violence_against_women', label: 'Violence against women'},
        {id: 'sexism', label: 'Gender stereotypes and sexism'},
        {id: 'public_health', label: 'Public health policies'},
        {id: 'maternal_child', label: 'Maternal and child health'},
        {id: 'infrastructure', label: 'Developing infrastructure'},
        {id: 'substance_abuse', label: 'Substance abuse'},
        {id: 'behavior_change', label: 'Behavior change'},
        {id: 'globalization', label: 'Globalization'},
        {id: 'labor_law', label: 'Labor law'},
        {id: 'stability', label: 'Political/economic stability'},
        {id: 'trafficking', label: 'Trafficking'},
        {id: 'diplomacy', label: 'Diplomacy'},
        {id: 'governance', label: 'Sustainable institutions of governance'},
        {id: 'urbanization', label: 'Urbanization'},
        {id: 'pop_planning', label: 'Population planning'},
        {id: 'sanitation', label: 'Sanitation'}
    ]);

    // draw connections between nodes
    var edges = new vis.DataSet([
        // sub-issues
        {from: 'corruption', to: 'service_access'},
        {from: 'tax_havens', to: 'service_access'},
        {from: 'debt', to: 'service_access'},
        {from: 'local_farming', to: 'agriculture'},
        {from: 'service_access', to: 'water'},
        {from: 'service_access', to: 'energy'},
        {from: 'service_access', to: 'education'},
        {from: 'service_access', to: 'econ_dev'},
        {from: 'service_access', to: 'inequality'},
        {from: 'service_access', to: 'social_integration'},
        {from: 'energy', to: 'employment'},
        {from: 'energy', to: 'econ_dev'},
        
        // Africa
        {from: 'democracy', to: 'africa'},
        {from: 'peace', to: 'africa'},
        {from: 'econ_dev', to: 'africa'},
        {from: 'human_rights', to: 'africa'},
        {from: 'climate', to: 'africa'},
        {from: 'poverty', to: 'africa'},
        {from: 'food', to: 'africa'},
        {from: 'water', to: 'africa'},
        {from: 'health', to: 'africa'},
        {from: 'education', to: 'africa'},
        {from: 'diseases', to: 'africa'},
        {from: 'decolonization', to: 'africa'},
        {from: 'gender_eq', to: 'africa'},
        {from: 'corruption', to: 'africa'},
        
        // Ageing
        {from: 'fertility', to: 'ageing'},
        {from: 'mortality', to: 'ageing'},
        {from: 'migration', to: 'ageing'},
        {from: 'ageing', to: 'welfare', label: 'e.g. retirement'},
        {from: 'ageing', to: 'employment'},
        {from: 'ageing', to: 'health'},
        
        // AIDS
        {from: 'gender_eq', to: 'aids'},
        {from: 'aids', to: 'health'},
        {from: 'aids', to: 'employment'},
        
        // Atomic Energy
        {from: 'nuclear', to: 'atomic_energy'},
        {from: 'atomic_energy', to: 'disarmament'},
        
        // Big Data
        {from: 'privacy', to: 'big_data'},
        {from: 'new_data', to: 'big_data'},
        {from: 'inequality', to: 'big_data'},
        {from: 'public_private', to: 'big_data'},
        
        // Children
        {from: 'education', to: 'children'},
        {from: 'food', to: 'children'},
        {from: 'health', to: 'children'},
        {from: 'gender_eq', to: 'children'},
        {from: 'abuse', to: 'children'},
        {from: 'peace', to: 'children'},
        
        // Climate
        {from: 'energy', to: 'climate'},
        {from: 'agriculture', to: 'climate'},
        {from: 'climate', to: 'agriculture'},
        {from: 'deforestation', to: 'climate'},
        {from: 'climate', to: 'health'},
        
        // Decolonization
        {from: 'state_building', to: 'decolonization'},
        {from: 'nation_building', to: 'decolonization'},
        {from: 'education', to: 'nation_building'},
        {from: 'language', to: 'nation_building'},
        {from: 'migration', to: 'nation_building', label: 'settled populations'},
        {from: 'media', to: 'nation_building', label: 'portrayal'},
        {from: 'econ_dev', to: 'decolonization'},
        
        // Democracy
        {from: 'governance', to: 'democracy'},
        {from: 'state_building', to: 'democracy'},
        {from: 'nation_building', to: 'democracy'},
        {from: 'elections', to: 'democracy'},
        {from: 'decolonization', to: 'democracy'},
        {from: 'peace', to: 'democracy'},
        {from: 'democracy', to: 'peace'},
        {from: 'econ_dev', to: 'democracy'},
        {from: 'media', to: 'democracy', label: 'inform voters'},
        {from: 'human_rights', to: 'democracy'},
        {from: 'democracy', to: 'human_rights'},
        {from: 'corruption', to: 'democracy'},
        {from: 'freedom', to: 'democracy'},
        {from: 'democracy', to: 'freedom'},
        {from: 'democracy', to: 'inequality'},
        {from: 'democracy', to: 'human_dev'},
        
        // Disarmament
        {from: 'nuclear_energy', to: 'disarmament'},
        
        // Poverty
        {from: 'gender_eq', to: 'poverty'},
        {from: 'econ_dev', to: 'poverty'},
        {from: 'dev_nations', to: 'poverty'},
        {from: 'employment', to: 'poverty'},
        {from: 'inequality', to: 'poverty'},
        {from: 'aids', to: 'poverty'},
        {from: 'food', to: 'poverty'},
        {from: 'poverty', to: 'food'},
        {from: 'health', to: 'poverty'},
        {from: 'poverty', to: 'health'},
        {from: 'crime', to: 'poverty'},
        {from: 'education', to: 'poverty'},
        {from: 'poverty', to: 'education'},
        {from: 'housing', to: 'poverty'},
        {from: 'poverty', to: 'housing'},
        {from: 'water', to: 'poverty'},
        {from: 'poverty', to: 'water'},
        {from: 'energy', to: 'poverty'},
        {from: 'service_access', to: 'poverty'},
        {from: 'human_capital', to: 'poverty'},
        {from: 'population', to: 'poverty'},
        {from: 'social_integration', to: 'poverty'},
        {from: 'poverty', to: 'social_integration'},
        {from: 'peace', to: 'poverty'},
        {from: 'decolonization', to: 'poverty'},
        {from: 'climate', to: 'poverty'},
        {from: 'poverty', to: 'climate'},
        {from: 'regional_conflict', to: 'poverty'},
        {from: 'poverty', to: 'democracy'},
        {from: 'poverty', to: 'children'},
        {from: 'children', to: 'poverty'},
        
        // Food
        {from: 'agriculture', to: 'food'},
        {from: 'supply_chain', to: 'food'},
        {from: 'service_access', to: 'food'},
        {from: 'water', to: 'food'},
        {from: 'peace', to: 'food'},
        {from: 'econ_policy', to: 'food'},
        {from: 'climate', to: 'food'},
        {from: 'econ_dev', to: 'food'},
        {from: 'migration', to: 'food'},
        {from: 'welfare', to: 'food'},
        {from: 'food_waste', to: 'food'},
        {from: 'population', to: 'food'},
        {from: 'gender_eq', to: 'food'},
        {from: 'food', to: 'gender_eq'},
        {from: 'gmos', to: 'food'},
        {from: 'food', to: 'children'},
        {from: 'food', to: 'climate'},
        {from: 'energy', to: 'food'},
        {from: 'food', to: 'energy'},
        
        // Gender
        {from: 'education', to: 'gender_eq'},
        {from: 'health', to: 'gender_eq'},
        {from: 'gender_eq', to: 'health'},
        {from: 'service_access', to: 'gender_eq'},
        {from: 'gender_eq', to: 'democracy', label: 'equal opportunity in decision-making'},
        {from: 'democracy', to: 'gender_eq', label: 'equal opportunity in decision-making'},
        {from: 'gender_eq', to: 'employment', label: 'equal opportunity and wage gap'},
        {from: 'gender_eq', to: 'eq_opp'},
        {from: 'culture', to: 'gender_eq'},
        {from: 'reproductive', to: 'gender_eq'},
        {from: 'property', to: 'gender_eq'},
        {from: 'women_rights', to: 'gender_eq'},
        {from: 'deep_legal_legislative', to: 'gender_eq'},
        {from: 'violence_against_women', to: 'gender_eq'},
        {from: 'sexism', to: 'gender_eq'},
        {from: 'gender_eq', to: 'econ_dev'},
        
        // Health
        {from: 'service_access', to: 'health'},
        {from: 'diseases', to: 'health'},
        {from: 'big_data', to: 'health'},
        {from: 'public_health', to: 'health'},
        {from: 'maternal_child', to: 'health'},
        {from: 'dev_nations', to: 'health'},
        {from: 'infrastructure', to: 'health'},
        {from: 'water', to: 'health'},
        {from: 'food', to: 'health'},
        {from: 'health', to: 'food'},
        {from: 'substance_abuse', to: 'health'},
        {from: 'behavior_change', to: 'health'},
        {from: 'education', to: 'health'},
        {from: 'inequality', to: 'health'},
        {from: 'employment', to: 'health'},
        {from: 'housing', to: 'health'},
        {from: 'social_integration', to: 'health'},
        
        // International Law and Justice
        {from: 'econ_policy', to: 'international_law'},
        {from: 'regional_conflict', to: 'international_law'},
        {from: 'international_law', to: 'econ_dev'},
        {from: 'international_law', to: 'human_dev'},
        {from: 'international_law', to: 'peace'},
        {from: 'international_law', to: 'human_rights'},
        {from: 'international_law', to: 'disarmament'},
        {from: 'international_law', to: 'climate'},
        {from: 'international_law', to: 'migration'},
        {from: 'international_law', to: 'oceans'},
        {from: 'international_law', to: 'dev_nations'},
        {from: 'international_law', to: 'labor_law'},
        
        // Migration
        {from: 'human_rights', to: 'migration'},
        {from: 'peace', to: 'migration'},
        {from: 'migration', to: 'peace'},
        {from: 'regional_conflict', to: 'migration'},
        {from: 'globalization', to: 'migration'},
        {from: 'labor_law', to: 'migration'},
        {from: 'crime', to: 'migration'},
        {from: 'climate', to: 'migration'},
        {from: 'migration', to: 'climate'},
        {from: 'stability', to: 'migration'},
        {from: 'social_integration', to: 'migration'},
        {from: 'health', to: 'migration'},
        {from: 'migration', to: 'human_dev'},
        {from: 'migration', to: 'poverty'},
        {from: 'migration', to: 'employment'},
        {from: 'culture', to: 'migration'},
        {from: 'migration', to: 'culture'},
        {from: 'water', to: 'migration'},
        {from: 'food', to: 'migration'},
        {from: 'trafficking', to: 'migration'},
        {from: 'housing', to: 'migration'},
        
        // Oceans and the Law of the Sea
        {from: 'crime', to: 'oceans'},
        {from: 'oceans', to: 'climate'},
        {from: 'climate', to: 'oceans'},
        {from: 'oceans', to: 'food'},
        {from: 'food', to: 'oceans'},
        {from: 'oceans', to: 'supply_chain'},
        {from: 'oceans', to: 'poverty'},
        {from: 'oceans', to: 'employment'},
        {from: 'oceans', to: 'econ_dev'},
        
        // Peace and Security
        {from: 'regional_conflict', to: 'peace'},
        {from: 'peace', to: 'regional_conflict'},
        {from: 'disarmament', to: 'peace'},
        {from: 'diplomacy', to: 'peace'},
        {from: 'culture', to: 'peace'},
        {from: 'state_building', to: 'peace'},
        {from: 'human_rights', to: 'peace'},
        {from: 'peace', to: 'gender_eq'},
        {from: 'gender_eq', to: 'peace'},
        {from: 'peace', to: 'trafficking', label: 'peacekeeper abuse'},
        {from: 'peace', to: 'violence_against_women', label: 'peacekeeper abuse'},
        {from: 'governance', to: 'peace'},
        {from: 'social_integration', to: 'peace'},
        {from: 'elections', to: 'peace'},
        {from: 'econ_dev', to: 'peace'},
        {from: 'crime', to: 'peace'},
        {from: 'human_dev', to: 'peace'},
        {from: 'democracy', to: 'peace'},
        
        // Population
        {from: 'aging', to: 'population'},
        {from: 'health', to: 'population'},
        {from: 'population', to: 'health'},
        {from: 'migration', to: 'population'},
        {from: 'urbanization', to: 'population'},
        {from: 'africa', to: 'population'},
        {from: 'pop_planning', to: 'population'},
        {from: 'population', to: 'climate'},
        {from: 'population', to: 'human_dev'},
        {from: 'population', to: 'food'},
        {from: 'population', to: 'water'},
        {from: 'population', to: 'poverty'},
        {from: 'population', to: 'employment'},
        {from: 'population', to: 'housing'},
        {from: 'population', to: 'governance'},
        {from: 'population', to: 'infrastructure'},
        
        // Refugees
        {from: 'social_integration', to: 'refugees'},
        {from: 'regional_conflict', to: 'refugees'},
        {from: 'climate', to: 'refugees'},
        {from: 'stability', to: 'refugees'},
        {from: 'peace', to: 'refugees'},
        {from: 'human_rights', to: 'refugees'},
        {from: 'culture', to: 'refugees'},
        {from: 'dev_nations', to: 'refugees'},
        {from: 'education', to: 'refugees'},
        {from: 'refugees', to: 'education'},
        {from: 'health', to: 'refugees'},
        {from: 'refugees', to: 'health'},
        {from: 'employment', to: 'refugees'},
        {from: 'refugees', to: 'employment'},
        {from: 'refugees', to: 'migration'},
        {from: 'refugees', to: 'trafficking'},
        
        // Water
        {from: 'sanitation', to: 'water'},
        {from: 'agriculture', to: 'water'},
        {from: 'governance', to: 'water'},
        {from: 'water', to: 'econ_dev'},
        {from: 'water', to: 'human_dev'},
        {from: 'water', to: 'food'},
        {from: 'water', to: 'energy'},
        {from: 'energy', to: 'water'},
        {from: 'water', to: 'health'},
        {from: 'water', to: 'dev_nations'},
        {from: 'water', to: 'poverty'},
        {from: 'water', to: 'human_rights'},
        
        // Youth
        {from: 'education', to: 'youth'},
        {from: 'health', to: 'youth'},
        {from: 'gender_eq', to: 'youth'},
        {from: 'econ_dev', to: 'youth'},
        {from: 'youth', to: 'social_integration'}
    ]);
    
    

    var container = document.getElementById('mynetwork');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        nodes: {
            widthConstraint: {
                maximum: 150
            },
            scaling: {
                label: false
            },
            shape: 'dot',
            mass: 2
        },
        edges: {
            arrows: {
                to: {
                    enabled: true,
                    scaleFactor: 0.5
                }
            }
        }
    };
    var network = new vis.Network(container, data, options);
    
    // set node size based on number of connected nodes
    nodes.forEach(node => {
        // using immediately-connected nodes because they have the most tangible impact, rather than recursing upward where it starts to become a stretch to connect A -> B -> C
        node.value = network.getConnectedNodes(node.id, 'to').length;
        nodes.updateOnly(node);
    });
    network.setData(data);
</script>
</body>

My conclusions are:
- Lack of access to basic services and gender inequality are at the root of many systemic issues (e.g. poverty, inequality, economic development)
- Similarly, economic development and the application of big data are "horizontal" beneath most issues and can advance progress on many issues simultaneously

# Appendix

## United Nations

The United Nations' list of [global issues](https://www.un.org/en/global-issues) reflect the issues the organization is trying to tackle through its [_Sustainable Development Goals_](https://sdgs.un.org/goals), which aim to promote human development while [balancing the economic, social, and environmental dimensions of sustainability](https://council.science/wp-content/uploads/2017/05/SDGs-Guide-to-Interactions.pdf). The SDGs represent a highly interlinked and indivisible agenda, with trade-offs and constraints in the implementation of goals to avoid detracting from others. Implementation is left up to each country, though the SDGs intentionally do not provide a plan of action or address the complexities and trade-offs that emerge.

### SDGs In Order

The SDGs have been [criticized for their broad scope and lack of prioritization strategy](https://www.sdgsinorder.org/context) ("[looking] more like an encyclopedia of development than a useful tool for action"). In response, New America and OECD created an [ordering of the Sustainable Development Goals](https://www.sdgsinorder.org/) designed to [optimize for stability in society and the state](https://www.sdgsinorder.org/context). They contend that a logical, ordered approach to tackling SDGs [makes a significant difference in effectiveness](https://www.sdgsinorder.org/context) over organizations and individuals pursuing their own specific issues due to self-interest. The ordering was created by surveying ["economists, political scientists and social scientists working in public institutions, international organizations, foundations, universities, think tanks and civil society groups around the world"](https://www.sdgsinorder.org/respondents), and asking them to identify and sequence the first 20 SDG targets that should be tackled as part of an effort to fulfill all SDGs.

Targets to promote rule of law and access to justice, and eliminate the most extreme poverty, were perceived as significantly more important than the others:

[![Sustainable Development Goal targets in order]({{ site.static_files | where: "name", "SDGs_In_Order_targets.png" | map: "path" | first }})](https://www.sdgsinorder.org/targets)

The targets chosen in the survey were mapped to their corresponding SDGs to rank the SDGs as well. Deviating from the target ordering, goals to reduce inequalities, eliminate poverty, achieve gender equality, and promote peace, justice, and strong institutions were perceived as significantly more important than the other SDGs:

[![Sustainable Development Goals in order]({{ site.static_files | where: "name", "SDGs_In_Order_goals.png" | map: "path" | first }})](https://www.sdgsinorder.org/goals)

The experts' philosophies of prioritization were also [categorized](https://www.sdgsinorder.org/criterion) into approaches that optimize for empowering individuals vs. strengthening institutions, and having a deliberate, calculated approach vs. moving quickly to address the most pressing challenges. The majority of approaches were individualistic, with a relatively even split between deliberation vs. urgency.

### SDG interactions (qualitative)

From [A Guide to SDG Interactions: from Science to Implementation](https://council.science/wp-content/uploads/2017/05/SDGs-Guide-to-Interactions.pdf):

> Although governments have stressed the integrated, indivisible and interlinked nature of the SDGs ..., important interactions and interdependencies are generally not explicit in the description of the goals or their associated targets. ... This report ... [explores] the important interlinkages within and between these goals and associated targets to support a more strategic and integrated implementation. Specifically, the report presents a framework for characterising the range of positive and negative interactions between the various SDGs, ... and tests this approach by applying it to an initial set of four SDGs: SDG2, SDG3, SDG7 and SDG14. This selection presents a mixture of key SDGs aimed at human well-being, ecosystem services and natural resources, but does not imply any prioritisation.

There aren't many details on the report's methodology, other than "the approach taken relied on an interpretive analytical process whereby research teams combine their knowledge and expert judgment with seeking of new evidence in the scientific literature and extensive deliberations about the character of different specific interactions". I presume the teams mapped their understanding of target interactions to the numerical framework mentioned in the report, which categorizes the positivity or negativity of each interaction.

Some of my takeaways are:

> This analysis found no fundamental incompatibilities between goals (i.e. where one target as defined in the 2030 Agenda would make it impossible to achieve another). However, it did identify a set of potential constraints and conditionalities that require coordinated policy interventions to shelter the most vulnerable groups, promote equitable access to services and development opportunities, and manage competing demands over natural resources to support economic and social development within environmental limits.

> It should also be clear that a good development action is one where all negative interactions are avoided or at least minimised, while at the same time maximising significant positive interactions; but this by no means suggests that policymakers should avoid attempting progress in those targets and goals that are associated with significant negative interactions – it merely suggests that in these cases policymakers should tread more carefully when designing policies and strategies.

> SDG16 (good governance) and SDG17 (means of implementation) are key to turning the potential for synergies into reality, although they are not always specifically highlighted as such throughout the report. For many if not all goals, having in place effective governance systems, institutions, partnerships, and intellectual and financial resources is key to an effective, efficient and coherent approach to implementation.

> Given budgetary, political and resource constraints, as well as specific needs and policy agendas, countries are likely to prioritise certain goals, targets and indicators over others. As a result of the positive and negative interactions between goals and targets, this prioritisation could lead to negative developments for ‘nonprioritised’ goals and targets. ... due to globalisation and increasing trade of goods and services, many policies and other interventions have implications that are transboundary in nature, such that pursuing objectives in one region can impact on other countries or regions’ pursuit of their objectives.

The following types of dependencies within a pair of goals/targets can be useful to contextualize their relationship/interactions:
- Directionality: whether the interaction is unidirectional, bidirectional, circular, or multiple
- Place-specific context: scale of the interaction, e.g. highly location-specific vs. generic across borders
- Governance: does poor governance create or amplify a negative relationship between the goals/targets?
- Technology: do technologies exist that can significantly mitigate the trade-off between the goals/targets?
- Time-frame: will the (positive or negative) interaction develop in real-time vs. over a long period of time?

Policies developed to address the SDGs should be coherent, i.e. systematically reduce conflicts and promote synergies between and within different policy areas to achieve policy objectives. Policy coherence is comprised of the following dimensions:
- Sectoral: coherent from one policy sector to another
- Transnational: observing to what extent the pursuit of objectives in one country will affect the ability of another to pursue its sovereign objectives
- Governance: coherent from one set of interventions to another
    - e.g. legal frameworks, investment frameworks, and policy instruments all pull in the same direction
    - It is often the case that while new policies and goals can be easily introduced, institutional capacities for implementation are not aligned with the new policy designs, because the former are commonly more difficult to develop
- Multilevel: coherent across multiple levels of government (international/national/local)
- Implementation: coherent along the implementation continuum: from policy objective, through instruments and measures agreed, to implementation on the ground
    - The latter often deviates substantially from the original policy intentions, as actors make their interpretations and institutional barriers and drivers influence their response to the policy

Takeaways on specific SDG interactions are included in the synthesized interactions graph above.

### SDG interactions (quantitative)

[A Systematic Study of Sustainable Development Goal (SDG) Interactions](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1002/2017EF000632) builds upon the previous (ISCU) qualitative analysis of SDG interactions by performing a statistical analysis of SDG indicators from country and country-disaggregated data. They capture interaction synergies and trade-offs by identifying significant positive and negative correlations in the indicator data.

They found the following SDG pairs have the most synergies and trade-offs:

{% assign PIK_SDG_Interactions_top_pairs = site.static_files | where: "name", "PIK_SDG_Interactions_top_pairs.jpg" | map: "path" | first %}
[![PIK top SDG interaction pairs]({{ PIK_SDG_Interactions_top_pairs }})]({{ PIK_SDG_Interactions_top_pairs }})

> The observed positive correlations between the SDGs have mainly two explanations. First, indicators of the SDGs depicting higher synergies consist of development indicators that are part of the MDGs and components of several development indices .... Second, the observed higher synergies among some SDGs are an effect of having the same indicator for multiple SDGs.

> Most trade-offs ... can be linked to the traditional nonsustainability development paradigm focusing on economic growth to generate human welfare at the expenses of environmental sustainability .... On average developed countries provide better human welfare but are locked-in to larger environmental and material footprints which need to be substantially reduced to achieve SDG 12 (Responsible consumption and production).

> We are aware that correlation does not imply causality. This means observed synergies between two SDG indicators could be independently related to another process driving both indicators and therefore resulting in correlations. However, because the correlation analysis is done for indicator pairs in each country individually, the existence of a large number of synergies (or trade-offs) suggests that the relation is widespread across many countries and most likely not appearing by chance.

Takeaways include:
- The conclusions from this quantitative study are largely in agreement with the qualitative ISCU study: there are typically more synergies than trade-offs within and among the SDGs in most countries, and fostering cross-sectoral and cross-goal synergetic relations will play a crucial role in operationalization of the SDG agenda.
- SDG 1 (No poverty) is associated with synergies across most SDGs and ranks five times in the global top-10 synergy pair list.
- Reducing poverty is statistically linked with progress in SDGs 3 (Good health and wellbeing), 4 (Quality education), 5 (Gender equality), 6 (Clean water and sanitation), or 10 (Reduced inequalities) for 75%–80% of the data pairs.
- Improvement of global health and well-being has highly been compatible with progress in SDGs 1 (Poverty reduction), 4 (Quality education), 5 (Gender equality), 6 (Provision of clean water and sanitation), and SDG 10 (Inequalities reduction) based on more than 70% of the data pairs.
- SDG 3 (Good health and well-being) was found to have a higher share of synergies with other SDGs in most of the countries and the world population .... Hence, a paradigm shift prioritizing good health and well-being, for example, by inter-sectoral and prevention based approaches, will have a greater impact than the conventional approaches ... and will also leverage attainment of other SDGs.
- The global top 10 pairs with trade-offs either consist of SDG 12 (Responsible consumption and production) or 15 (Life on land).
- SDGs 8 (Decent work and economic growth), 9 (Industry, innovation, and infrastructure), 12 (Responsible consumption and production), and 15 (Life on land) are associated with a high fraction of trade-offs across SDGs.

## World Economic Forum

The World Economic Forum generates an annual _Global Risks Report_ by surveying their "extensive network of academic, business, government, civil society and thought leaders" about their largest perceived global risks. These reports rank the importance of issues over short- (2-year), medium- (5-year), and long-term (10-year) horizons, and often feature a map of interconnections between issues with weighted causality, which is relevant to the objectives of this post.

However, it seems the risks are primarily relative to governments and businesses, [have an elite-centric perspective](https://www.tni.org/en/article/world-economic-forum-a-history-and-analysis), and do not consider fundamental issues affecting individuals (e.g. poverty and gender equality) to be "risks". Additionally, the reports seem inconsistent in their long-term risk perceptions, and follow trends and FUD du jour. Nevertheless, they provide an additional perspective on interconnection and causality, to be taken with a grain of salt.

### Causality

Since 2021, the WEF reports have included a section that analyzes causality and downstream effects between issues. These are included below, with my respective conclusions under each year.

In 2023, the following risks were identified as especially consequential if they were to be triggered. This doesn't necessarily indicate high individual _impact/severity_ of these risks, but rather high _influence_ for exacerbating other issues. An interactive version is available [here](https://www.weforum.org/reports/global-risks-report-2023/data-on-global-risk-perceptions-2023) under the "Causes & Consequences" tab.

{% assign 2023_risks_interconnections = site.static_files | where: "name", "WEF_Global_Risks_Report_2023_global_risks_landscape.png" | map: "path" | first %}
[![WEF Global Risks Report 2023 global risks landscape]({{ 2023_risks_interconnections }})]({{ 2023_risks_interconnections }})

- Cohesion is tightly coupled between the societal, geopolitical, and economic spheres; if one sphere collapses, it has significant consequences for the others

2022's report shows the perceived downstream effects of the top 5 most severe 10-year risks; interactive version [here](https://www.weforum.org/reports/global-risks-report-2022/data-on-global-risks-perceptions), under "Global Risks Effects".

{% assign 2022_risks_interconnections = site.static_files | where: "name", "WEF_Global_Risks_Report_2022_global_risk_effects.png" | map: "path" | first %}
[![WEF Global Risks Report 2022 global risk effects]({{ 2022_risks_interconnections }})]({{ 2022_risks_interconnections }})

- Climate action failure leads to further damage in the environmental and societal spheres (involuntary migration, livelihood crises, and social cohesion erosion)

2021's report shows the perceived drivers (opposite of 2022) of the top 5 most severe 10-year risks; interactive version [here](https://report.weforum.org/GRR/edition-21/survey-results/the-global-risks-network-2021/).

{% assign 2021_risks_interconnections = site.static_files | where: "name", "WEF_Global_Risks_Report_2021_global_risks_network.png" | map: "path" | first %}
[![WEF Global Risks Report 2021 global risks network]({{ 2021_risks_interconnections }})]({{ 2021_risks_interconnections }})

- Climate action failure and human environmental damage reinforce one another
- Climate action is impeded by geopolitical issues (interstate relations, resources, multilateralism), economic issues (stagnation, debt), and societal issues (livelihood crises, social cohesion erosion), in that order
- Livelihood crises are caused by a relatively even distribution of societal factors (social security collapse and diseases (COVID)), economic factors (stagnation and debt), and technological factors (to a lesser extent than the others; digital inequality and adverse tech advances)
- Social cohesion erosion is primarily driven by other societal factors (livelihood crises, social security collapse, youth disillusionment, involuntary migration), and technological factors to a lesser extent (digital inequality, adverse tech advances)

### Interconnections

Prior to 2021, the reports analyzed risk interconnections (without causality) by surveying "the most strongly connected" pairs of global risks. Interactive versions of this section of the report are available for [2020](https://report.weforum.org/GRR/edition-20/survey-results/the-global-risks-interconnections-map-2020/), [2019](https://report.weforum.org/GRR/edition-19/survey-results/global-risks-landscape-2019/), and [2018](https://report.weforum.org/GRR/edition-18/global-risks-landscape-2018/). [Node size and edge weight are based on number of appearances (of a given risk, or pair of risks, respectively) in survey results](https://www3.weforum.org/docs/WEF_Global_Risks_Report_2019.pdf).

Risk pairs that were consistently perceived as strongly connected include:
- State collapse or crisis & involuntary migration
- Interstate conflict & involuntary migration
- Unemployment & social instability
- Climate action failure & extreme weather