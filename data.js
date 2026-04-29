
const COMIDA_PRODUCTOS = [
  { id: 'sm01', nombre: 'Sandwich miga jamón y queso', cat: 'Sandwiches de miga' },
  { id: 'sm02', nombre: 'Sandwich miga negra jamón y queso', cat: 'Sandwiches de miga' },
  { id: 'sm03', nombre: 'Sandwich miga pollo', cat: 'Sandwiches de miga' },
  { id: 'sm04', nombre: 'Sandwich miga bondiola', cat: 'Sandwiches de miga' },
  { id: 'sm05', nombre: 'Sandwich miga huevo', cat: 'Sandwiches de miga' },
  { id: 'sm06', nombre: 'Sandwich miga huevo con morrón', cat: 'Sandwiches de miga' },
  { id: 'sm07', nombre: 'Sandwich miga huevo con aceitunas', cat: 'Sandwiches de miga' },
  { id: 'sm08', nombre: 'Sandwich miga tomate', cat: 'Sandwiches de miga' },
  { id: 'sm09', nombre: 'Sandwich miga tomate y lechuga', cat: 'Sandwiches de miga' },
  { id: 'sm10', nombre: 'Sandwich miga choclo', cat: 'Sandwiches de miga' },
  { id: 'sm11', nombre: 'Sandwich miga zanahoria', cat: 'Sandwiches de miga' },
  { id: 'sm12', nombre: 'Sandwich miga atún', cat: 'Sandwiches de miga' },
  { id: 'sm13', nombre: 'Sandwich miga crudo', cat: 'Sandwiches de miga' },
  { id: 'sm14', nombre: 'Sandwich miga negra crudo', cat: 'Sandwiches de miga' },
  { id: 'sm15', nombre: 'Sandwich miga roquefort', cat: 'Sandwiches de miga' },
  { id: 'sm16', nombre: 'Sandwich miga milán', cat: 'Sandwiches de miga' },
  { id: 'sm17', nombre: 'Sandwich miga ananá', cat: 'Sandwiches de miga' },
  { id: 'em01', nombre: 'Empanada jamón y queso', cat: 'Empanadas' },
  { id: 'em02', nombre: 'Empanada caprese', cat: 'Empanadas' },
  { id: 'em03', nombre: 'Empanada pollo', cat: 'Empanadas' },
  { id: 'em04', nombre: 'Empanada verdura', cat: 'Empanadas' },
  { id: 'em05', nombre: 'Empanada carne', cat: 'Empanadas' },
  { id: 'em06', nombre: 'Empanada carne salada', cat: 'Empanadas' },
];

const STOCK_GRUPOS_PASTELERIA = [
  {
    id: 'postres', label: 'Postres', items: [
      'Arrollado negro','Arrollado oreo','Balcarce','Brownie DDL mousse merengue',
      'Chajá de frutilla','Cheesecake cocido','Chocolina','Gateau','Golosina',
      'Red velvet','Chocolatera','Marmolada blanca','Marquesa blanca','Mayesti',
      'Clásico mousse de DDL','Clásico mousse de chocolate','Ópera','Oreo',
      'Selva negra','Tiramisú','Masini','Delicia de pistacho','Imperial ruso',
      'Sacher','Torta vienesa',
    ]
  },
  {
    id: 'porciones', label: 'Porciones', items: [
      'Brownie DDL mousse merengue','Cheesecake cocido','Massini',
      'Mousse de banana','Mousse de chocolate','Ópera',
      'Selva negra','Sopa inglesa','Tiramisú','Chocolina',
    ]
  },
  {
    id: 'masas', label: 'Masas finas', items: [
      'Cheese cake','Lemon pie','Mousse de banana','Coquitos','Pañuelo de crema',
      'Pañuelo de DDL','Pañuelos mixtos','Selva negra','Massini','Tartaleta de crema',
      'Tartaleta mousse de chocolate','Tartaleta mousse de DDL','Bombita de DDL',
      'Canolis','Persiana','Copito blanco','Copito negro','Arrollado DDL','Oreo',
      'Tiramisú','Mil hojita','Trufa','Borrachito','Arrollado de crema',
    ]
  },
  {
    id: 'tartas', label: 'Tartas', items: [
      'Lemon pie','Tarta frutilla','Tarta felicidades celeste','Tarta felicidades rosa','Tarta ricota',
      'Mini lemon pie','Mini tarta frutilla','Mini tarta frutal','Mini tarta ricota',
    ]
  },
  {
    id: 'seca', label: 'Pastelería seca', items: [
      'Alfajor choco negro','Alfajor choco blanco','Alfajor maizena',
      'Pepitos alfajor','Alfajorcito choco x kg','Alfajorcito maizena x kg',
      'Budín 1/4 nuez','Budín 1/4 limón','Budín 1/4 marmolado',
      'Budín 1/4 chips chocolate','Budín 1/4 inglés','Budín 1/4 vainilla',
      'Copacabana','Copitos choco blanco','Copitos choco negro',
      'Havanet','Havana Mar del Plata','Havanna','CABSHA',
      'Havanet mediana','Havanna mediana','CABSHA mediana','Masas secas',
      'Mil hoja cuadrada','Mil hoja redonda','Mini mil hojas','Muffins',
      'Pasta frola batata','Pasta frola DDL','Pasta frola membrillo',
      'Pasta frola batata med.','Pasta frola DDL med.','Pasta frola membrillo med.',
    ]
  },
];

const STOCK_CUARTERIO = [
  'Palmeritas','Palitos materos','Membrillitos','Azucarados blancos','Azucarados negros',
  'Bizcochos de grasa','Pepitos','Pepas surtidas','Polvorones',
  'Pebetes x2','Alpargata','Pan de hamburguesa x4','Pan de pancho x6',
  'Prepizzas','Prepizzas de cebolla','Pizzetas','Pizzetas de cebolla',
  'Pasteles de membrillo','Pasteles de batata',
  'Grisines c/sal','Grisines salvado c/sal','Grisines s/sal','Grisines salvado s/sal',
  'Marineras c/sal','Marineras salvado c/sal','Marineras s/sal','Marineras salvado s/sal',
  'Láminas de queso','Talitas bravas','Talitas de queso','Talitas de cebolla',
  'Talitas de orégano','Talitas de jamón','Talitas de salame',
  'Pan de molde integral','Pan flauta integral','Pan rallado','Pan lactal',
  'Volovanes','Napolitano','Napolitano blanco','Canolis','Canolis para bandeja',
  'Palmeras','Empanadas batata','Empanadas membrillo',
];

const TODOS_PRODUCTOS = [
  ...COMIDA_PRODUCTOS.map(p => p.nombre),
  ...STOCK_GRUPOS_PASTELERIA.flatMap(g => g.items),
  ...STOCK_CUARTERIO,
].filter((v, i, a) => a.indexOf(v) === i);

const MOTIVOS_BAJA = ['Vencido','Dañado / Aplastado','Mal elaborado','Sobrante','Otro'];
