# Update 18-03
# Descripción
- La APP toma los valores de ingresos y de egresos a traves de dos formularios y los va sumando por separado obteniendo los respectivos totales y saldo restante.
Nos muestra listado de ingresos, listado de egresos, totales de ambos y el saldo restante - RESUELTO.

# Funcionalidades
- Función Agregar Ingresos: Toma los valores del formulario, los valida y los agrega al listado - RESUELTO.
- Función Agregar Egresos: Toma los valores del formulario, los valida y los agrega al listado - RESUELTO.
- Función Suma Ingresos: Realiza la suma de todos los ingresos que vayan surgiendo y lo muestra en Total - RESUELTO.
- Función Suma Egresos: Realiza la suma de todos los egresos que vayan surgiendo y lo muestra en Total - RESUELTO.
- Función Resta: Realiza la resta de los egresos a los ingresos y lo muestra en Restante - RESUELTO.
- Función Comprobación de Restante: El color de fondo de RESTANTE debe cambiar según el porcentaje de saldo disponible ( 50% / 25% / 10% ) - RESUELTO.
- Función Editar: Tanto los ingresos como egresos se deben poder editar a través de un BTN de Edición - PENDIENTE.
- Función Eliminar: Tanto los ingresos como egresos se deben poder eliminar a través de un BTN de Eliminar - RESUELTO en Income, pero no impacta automáticamente en el front ni en la DB.
- Se conectó a IndexedDB.
- Se agregó Función Imprimir Alertas con un TimeOut de 3 seg.

Conflictos a resolver:
- Mejorar las funciones para hacerlas reutlizables, algunas están duplicadas.
- IndexedDB no carga los ingresos ni los muestra si no se actualiza la página.
- Al aplicar el Format Currency no se realizan los cálculos matemáticos.
