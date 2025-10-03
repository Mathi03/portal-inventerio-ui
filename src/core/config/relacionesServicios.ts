export const RELACIONES_TIPO_CIRCUITO = [
  {
    id: 0,
    name: "ADL",
    servicios_asociados: [{ name: "serv_datos" }, { name: "serv_ip" }],
  },
  {
    id: 1,
    name: "ATM",
    servicios_asociados: [{ name: "serv_atm" }, { name: "serv_ip" }],
  },
  {
    id: 2,
    name: "Bluelink",
    servicios_asociados: [{ name: "serv_datos" }, { name: "serv_ip" }],
  },
  {
    id: 3,
    name: "CDC",
    servicios_asociados: [{ name: "serv_cdc" }, { name: "serv_ip" }],
  },
  {
    id: 4,
    name: "CPA Entrante",
    servicios_asociados: [
      { name: "serv_cpa" },
      { name: "serv_cpa_final" },
      { name: "serv_ip" },
    ],
  },
  {
    id: 5,
    name: "CPA Mixto",
    servicios_asociados: [
      { name: "serv_cpa" },
      { name: "serv_cpa_final" },
      { name: "serv_ip" },
    ],
  },
  {
    id: 6,
    name: "CPA Saliente",
    servicios_asociados: [
      { name: "serv_cpa" },
      { name: "serv_cpa_final" },
      { name: "serv_ip" },
    ],
  },
  {
    id: 7,
    name: "Datos (CSD)",
    servicios_asociados: [{ name: "serv_datos" }, { name: "serv_ip" }],
  },
  {
    id: 8,
    name: "DLC",
    servicios_asociados: [{ name: "serv_datos" }, { name: "serv_ip" }],
  },
  {
    id: 9,
    name: "Frame Realy (FRP)",
    servicios_asociados: [{ name: "serv_datos" }, { name: "serv_ip" }],
  },
  {
    id: 10,
    name: "VOZ (CSD)",
    servicios_asociados: [{ name: "serv_datos" }, { name: "serv_ip" }],
  },
  {
    id: 11,
    name: "Diamux",
    servicios_asociados: [{ name: "serv_cpa" }],
  },
  {
    id: 12,
    name: "POST",
    servicios_asociados: [{ name: "serv_datos" }, { name: "serv_ip" }],
  },
  {
    id: 13,
    name: "MPLS",
    servicios_asociados: [
      { name: "serv_mpls" },
      { name: "serv_MPLS_final" },
      { name: "serv_ip_final" },
    ],
  },
  {
    id: 14,
    name: "Centrex",
    servicios_asociados: [{ name: "serv_centrex" }, { name: "serv_ip" }],
  },
  {
    id: 15,
    name: "Internet Dedicado",
    servicios_asociados: [
      { name: "serv_datos" },
      { name: "serv_ip" },
      { name: "serv_ip_final" },
    ],
  },
  {
    id: 16,
    name: "Internet Banda Ancha",
    servicios_asociados: [{ name: "serv_ba" }, { name: "serv_ip" }],
  },
  {
    id: 17,
    name: "Lan 2 Lan Estrella",
    servicios_asociados: [
      { name: "serv_lan2lan" },
      { name: "serv_ip" },
      { name: "serv_ip_final" },
    ],
  },
  {
    id: 18,
    name: "VPN INALAMBRICA",
    servicios_asociados: [{ name: "serv_vpni" }, { name: "serv_ip" }],
  },
  {
    id: 19,
    name: "Lan 2 Lan",
    servicios_asociados: [
      { name: "serv_lan2lan" },
      { name: "serv_ip" },
      { name: "serv_ip_final" },
    ],
  },
  {
    id: 20,
    name: "ZONA MOVISTAR WIFI",
    servicios_asociados: [
      { name: "serv_datos" },
      { name: "serv_ip" },
      { name: "serv_ip_final" },
      { name: "serv_wifi" },
    ],
  },
  {
    id: 21,
    name: "IVR_BASICO",
    servicios_asociados: [{ name: "No Aplica" }, { name: "serv_ip" }],
  },
  {
    id: 23,
    name: "INTERNET NEGOCIOS",
    servicios_asociados: [{ name: "No Aplica" }, { name: "serv_ip" }],
  },
  {
    id: 24,
    name: "SAM PMP",
    servicios_asociados: [{ name: "No Aplica" }, { name: "serv_ip" }],
  },
  {
    id: 25,
    name: "TRONCAL SIP",
    servicios_asociados: [
      { name: "serv_cpa" },
      { name: "serv_ip" },
      { name: "serv_sip_trunk" },
    ],
  },
  {
    id: 32,
    name: "WIFI CORPORATIVO BASICO",
    servicios_asociados: [
      { name: "serv_datos" },
      { name: "serv_ip" },
      { name: "serv_ip_final" },
      { name: "serv_wifi" },
    ],
  },
  {
    id: 33,
    name: "WIFI CORPORATIVO PREMIUM",
    servicios_asociados: [
      { name: "serv_datos" },
      { name: "serv_ip" },
      { name: "serv_ip_final" },
      { name: "serv_wifi" },
    ],
  },
  {
    id: 34,
    name: "INTERNET SATELITAL",
    servicios_asociados: [
      { name: "serv_datos" },
      { name: "serv_ip" },
      { name: "serv_ip_final" },
    ],
  },
  {
    id: 35,
    name: "INTERNET NEGOCIOS FIBRA",
    servicios_asociados: [
      { name: "serv_datos" },
      { name: "serv_ip" },
      { name: "serv_ip_final" },
    ],
  },
  {
    id: 36,
    name: "INTERNET DEDICADO FIBRA",
    servicios_asociados: [
      { name: "serv_datos" },
      { name: "serv_ip" },
      { name: "serv_ip_final" },
    ],
  },
  {
    id: 38,
    name: "M2M RP",
    servicios_asociados: [
      { name: "serv_mpls" },
      { name: "serv_ip_final" },
      { name: "serv_m2m" },
    ],
  },
];
