---
title: Combinar medios de pago en el checkout
name: Payments V2.1
company: Mercado Libre
kind: Frontend web
summary: Migración de los pagos del checkout de Mercado Libre a V2 y V2.1, para combinar medios de pago y descuentos inteligentes, con observabilidad en Datadog, New Relic y Kibana.
url: https://www.mercadolibre.com
urlLabel: mercadolibre.com
stack: [React, Express.js, Sass, React Testing Library, Datadog, New Relic, Kibana]
cover: ../../../assets/projects/payments-v2/cover.png
coverAlt: Pantalla del checkout para elegir cómo pagar, con la opción de combinar dos medios de pago
order: 1
gallery:
  - src: ../../../assets/projects/payments-v2/1.png
    alt: Lista de medios de pago con el switch "Combinar 2 medios de pago" apagado
  - src: ../../../assets/projects/payments-v2/2.png
    alt: La misma lista con el switch encendido, lista para elegir dos medios
  - src: ../../../assets/projects/payments-v2/3.png
    alt: Una tarjeta y el dinero disponible seleccionados para pagar juntos
  - src: ../../../assets/projects/payments-v2/4.png
    alt: Pantalla para ingresar el monto que se paga con el primer medio
  - src: ../../../assets/projects/payments-v2/5.png
    alt: Monto restante a pagar con el segundo medio
  - src: ../../../assets/projects/payments-v2/6.png
    alt: Selector del segundo medio sobre el monto restante
---

Participé en la migración del sistema de pagos del checkout de Mercado Libre a sus versiones V2 y
V2.1: ahora se pueden combinar varios medios de pago y aplicar descuentos inteligentes en una misma
compra, sobre una arquitectura preparada para escalar.

## Observabilidad

Una parte clave del cambio fue ver todo el sistema. Sumamos New Relic, Datadog y Kibana, y armamos
en Datadog un semáforo para medir y controlar el tráfico en tiempo real.

## Monitoreo y debugging

Mejoramos el logueo en Kibana para encontrar problemas más rápido, y en New Relic sumamos logs
enriquecidos para medir el rendimiento de cada transacción.

## Impacto

Más visibilidad, una arquitectura renovada y funcionalidades invisibles para quien compra hicieron
el checkout más robusto, y las nuevas combinaciones de pago abrieron el comercio electrónico a más
personas.
