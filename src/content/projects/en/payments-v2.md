---
title: Combining payment methods in the checkout
name: Payments V2.1
company: Mercado Libre
kind: Frontend web
summary: Migration of Mercado Libre's checkout payments to V2 and V2.1, so buyers can combine payment methods and smart discounts, with observability in Datadog, New Relic and Kibana.
url: https://www.mercadolibre.com
urlLabel: mercadolibre.com
stack: [React, Express.js, Sass, React Testing Library, Datadog, New Relic, Kibana]
cover: ../../../assets/projects/payments-v2/cover.png
coverAlt: Checkout screen to choose how to pay, with the option to combine two payment methods
order: 1
gallery:
  - src: ../../../assets/projects/payments-v2/1.png
    alt: Payment methods list with the "combine 2 payment methods" switch off
  - src: ../../../assets/projects/payments-v2/2.png
    alt: The same list with the switch on, ready to pick two methods
  - src: ../../../assets/projects/payments-v2/3.png
    alt: A card and the account balance selected to pay together
  - src: ../../../assets/projects/payments-v2/4.png
    alt: Screen to enter the amount paid with the first method
  - src: ../../../assets/projects/payments-v2/5.png
    alt: Remaining amount to pay with the second method
  - src: ../../../assets/projects/payments-v2/6.png
    alt: Second method picker over the remaining amount
---

I took part in migrating the payment system of Mercado Libre's checkout to its V2 and V2.1
versions: buyers can now combine several payment methods and apply smart discounts in one purchase,
on an architecture ready to scale.

## Observability

A key part of the change was seeing the whole system. We added New Relic, Datadog and Kibana, and
built a traffic-light dashboard in Datadog to measure and control traffic in real time.

## Monitoring and debugging

We improved logging in Kibana to find problems faster, and added enriched logs in New Relic to
measure the performance of every transaction.

## Impact

Better visibility, a renewed architecture and features that are invisible to the buyer made the
checkout sturdier, and the new payment combinations opened online shopping to more people.
