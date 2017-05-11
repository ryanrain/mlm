import { LecturaModel } from '../../models/lectura.model';

export class LecturasContent {

    lecturas: LecturaModel[] = [
        {
            title: 'Gabriel',
            img: 'gabriel.png',
            text: `
<p>Gabriel, Gabriel, no hay nadie como él.</p>
<p>Siempre con herramientas en la mano y tomando notas en papel.</p>
<p>Gabriel, Gabriel, no hay nadie como él.</p>
<p>Ayuda en las labores de su casa y a sus hermanas les prepara pan con miel.</p>
<p>Gabriel, Gabriel, no hay nadie como él.</p>
<p>Gabriel es muy activo, come de todo, en especial ensaladas de betabel.</p>
<p>Gabriel, Gabriel, no hay nadie como él.</p>
<p>En cada fiesta o cumpleaños, él organiza y sirve los platos de pastel.</p>
<p>También hace coronas con diamantina, adornadas con cordel y oropel.</p>
<p>Gabriel, Gabriel, no hay nadie como él.</p>
            `,
            preguntas:[
                {
                    pregunta: '¿Gabriel toma notas en?',
                    respuesta1: 'papel',
                    respuesta2: 'periódico',
                    respuesta3: 'libro',
                    respuestaCorrecta: 'papel',
                },
                {
                    pregunta: '¿Gabriel ayuda en las labores de?',
                    respuesta1: 'escuela',
                    respuesta2: 'casa',
                    respuesta3: 'calle',
                    respuestaCorrecta: 'casa',
                },
                {
                    pregunta: '¿Gabriel come ensalada de?',
                    respuesta1: 'berros',
                    respuesta2: 'zanahoria',
                    respuesta3: 'betabel',
                    respuestaCorrecta: 'betabel',
                },
                {
                    pregunta: '¿Gabriel sirve platos con?',
                    respuesta1: 'verduras',
                    respuesta2: 'pastel',
                    respuesta3: 'postres',
                    respuestaCorrecta: 'pastel',
                },
            ]
        },

        {
            title: 'Carmen',
            img: 'carmen.png',
            text: `
            <p>Carmen ama la limpieza de los pies a la cabeza.</p>
<p>Al amanecer, Carmen muy bien se asea y en su ropa no hay ninguna impureza.</p>
<p>Carmen ama la limpieza de los pies a la cabeza.</p>
<p>Ella va muy bien peinada y le dicen que parece una princesa.</p>
<p>Carmen ama la limpieza de los pies a la cabeza.</p>
<p>Carmen juega con sus tacitas de té muy arregladas en la mesa y convida a sus invitados galletas de fresa, piña y cereza.</p>
<p>Carmen ama la limpieza de los pies a la cabeza.</p>
<p>Es una damita que usa vestidos color turquesa.</p>
            `,
            preguntas: [
                {
                    pregunta: '¿Qué es lo que más ama Carmen?',
                    respuesta1: 'jugar',
                    respuesta2: 'limpiar',
                    respuesta3: 'cantar',
                    respuestaCorrecta: 'limpiar',
                },
                {
                    pregunta: '¿A quién se parece?',
                    respuesta1: 'mamá',
                    respuesta2: 'princesa',
                    respuesta3: 'muñeca',
                    respuestaCorrecta: 'princesa',
                },
                {
                    pregunta: '¿Qué es lo que más ama Carmen?',
                    respuesta1: 'jugar',
                    respuesta2: 'limpiar',
                    respuesta3: 'cantar',
                    respuestaCorrecta: 'limpiar',
                },
                {
                    pregunta: '¿Con qué juega?',
                    respuesta1: 'muñecas',
                    respuesta2: 'tacitas de té',
                    respuesta3: 'pelota',
                    respuestaCorrecta: 'tacitas de té',
                },
                {
                    pregunta: '¿De qué color es su vestido?',
                    respuesta1: 'rosa',
                    respuesta2: 'verde',
                    respuesta3: 'turquesa',
                    respuestaCorrecta: 'turquesa',
                },
                {
                    pregunta: '¿De qué sabor son las galletas?',
                    respuesta1: 'chocolate',
                    respuesta2: 'vainilla',
                    respuesta3: 'fresa',
                    respuestaCorrecta: 'fresa',
                }
            ]
        },        
        {
            title: 'Elizabeth',
            img: 'elizabeth.png',
            text: `
            <p>Elizabeth es dulce y generosa.</p>
<p>Elizabeth es una niña cariñosa y bondadosa.</p>
<p>A ella le gustan los moños y vestir de rosa.</p>
<p>Elizabeth es dulce y cariñosa.</p>
<p>Le gusta ir al jardín a cortar dalias, margaritas y flores rosas.</p>
<p>Ella siempre comparte su sombrilla las tardes de lluvia copiosa.</p>
<p>Elizabeth es dulce y generosa.</p>
<p>Si presta cada uno de sus juguetes, ella juega a otra cosa.</p>
<p>También comparte las galletas que le prepara su abuela cariñosa.</p>
            `,
            preguntas: [
                {
                    pregunta: '¿Cómo se describe a Elizabeth?',
                    respuesta1: 'dulce y generosa',
                    respuesta2: 'llorona y gritona',
                    respuesta3: 'penosa y juguetona',
                    respuestaCorrecta: 'dulce y generosa',
                },
                {
                    pregunta: '¿A qué va al jardín?',
                    respuesta1: 'jugar con la pelota',
                    respuesta2: 'jugar escondidas',
                    respuesta3: 'cortar las flores',
                    respuestaCorrecta: 'cortar las flores',
                },
                {
                    pregunta: '¿Que hace si presta sus juguetes?',
                    respuesta1: 'se enoja',
                    respuesta2: 'juega a otra cosa',
                    respuesta3: 'se aburre',
                    respuestaCorrecta: 'juega a otra cosa',
                },
                {
                    pregunta: '¿Qué otras cosas comparte?',
                    respuesta1: 'dulces',
                    respuesta2: 'pelotas',
                    respuesta3: 'galletas',
                    respuestaCorrecta: 'galletas',
                }
            ]
        },        
        {
            title: 'Ana María',
            img: 'ana.png',
            text: `
            <p>Ana María juega y pone cada cosa en su lugar.</p>
<p>Ana María está llena de vida.</p>
<p>Sola o en compañía le gusta saltar, también bota la pelota, brinca la cuerda, corre y se pone a cantar.</p>
<p>Ana María juega y pone cada cosa en su lugar.</p>
<p>En la casa y en la escuela a ella le gusta sus dibujos colorear.</p>
<p>En su recámara, muchos cuadros pintará.</p>
<p>Ana María juega y pone cada cosa en su lugar.</p>
<p>Ella pone los colores ordenados en su caja al terminar de jugar, porque dice: "hay un lugar para cada cosa y cada cosa en su lugar".</p>
            `,
            preguntas: [
                {
                    pregunta: '¿Qué le gusta hacer a Ana María?',
                    respuesta1: 'cantar',
                    respuesta2: 'correr',
                    respuesta3: 'brincar',
                    respuestaCorrecta: 'brincar',
                },
                {
                    pregunta: '¿Qué hace al terminar de jugar?',
                    respuesta1: 'dormir',
                    respuesta2: 'lavarse las manos',
                    respuesta3: 'pone cada cosa en su lugar',
                    respuestaCorrecta: 'pone cada cosa en su lugar',
                },
                {
                    pregunta: '¿Qué tiene en su cuarto?',
                    respuesta1: 'juguetes',
                    respuesta2: 'flores',
                    respuesta3: 'cuadros',
                    respuestaCorrecta: 'cuadros',
                }
            ]
        },        
        {
            title: 'Los cinco dedos de la mano',
            img: '5dedos.png',
            text: `
            <p>Me gusta jugar con mis manos: las abro y las cierro; las sacudo, y como si fuera un espejo, pongo frente a los dedos de cada mano.</p>
<p>Cinco dedos en cada mano tengo yo.</p>
<p>El primero se llama pulgar y con él al cielo puedo apuntar.</p>
<p>Cinco dedos en cada mano tengo yo.</p>
<p>El segundo se llama índice y con él cualquier lugar puedo señalar.</p>
<p>Cinco dedos en cada mano tengo yo.</p>
<p>El tercero es el cordial y con él un piano "invisible" puedo tocar.</p>
<p>Cinco dedos en cada mano tengo yo.</p>
<p>El cuarto es el anular y con muchos anillos lo van a adornar.</p>
<p>Cinco dedos en cada mano tengo yo.</p>
<p>El quinto es el meñique, es el pequeño, pero se levanta elegante a jugar.</p>
<p>Cinco dedos en cada mano tengo yo.</p>
            `,
            preguntas: [
                {
                    pregunta: '¿Cómo se llama el tercer dedo de la mano?',
                    respuesta1: 'pulgas',
                    respuesta2: 'cordial',
                    respuesta3: 'meñique',
                    respuestaCorrecta: 'cordial',
                },
                {
                    pregunta: '¿Cuántos dedos hay en una mano?',
                    respuesta1: 'tres',
                    respuesta2: 'seis',
                    respuesta3: 'cinco',
                    respuestaCorrecta: 'cinco',
                },
                {
                    pregunta: '¿Cómo se llama el primer dedo de la mano?',
                    respuesta1: 'índice',
                    respuesta2: 'anular',
                    respuesta3: 'pulgar',
                    respuestaCorrecta: 'índice',
                },
                {
                    pregunta: '¿Cuál dedo se adorna con anillos?',
                    respuesta1: 'meñique',
                    respuesta2: 'anular',
                    respuesta3: 'pulgar',
                    respuestaCorrecta: 'anular',
                }
            ]
        },        
        {
            title: 'Mamá',
            img: 'mama2.png',
            text: `
            <p>En el cielo falta una estrella, la más luminosa, la más bella.</p>
<p>Esa estrella vive en mi casa, me arropa en la noche y me asea por la mañana.</p>
<p>Antes de ir a la escuela me da cereal con pasas y una redonda manzana.</p>
<p>En el cielo falta una estrella, la más luminosa, la más bella.</p>
<p>Los días fríos me abraza para convidarme su calor y contarme cuentos de su nana.</p>
<p>Los días de calor nos quedamos en casa, saltamos y cantamos como si fuéramos una rana.</p>
<p>En el cielo falta una estrella, la más luminosa, la más bella.</p>
<p>Al terminar las clases mi mamá ya me espera, soy feliz cuando suena la campana.</p>
<p>Me toma de la mano y a la casa vamos, yo, en mi uniforme, ella con su traje de pana.</p>
<p>En el cielo falta una estrella, la más luminosa, la más bella.</p>
<p>Me cuida cuando me enfermo, me sirve calditos calientes y trocitos de manzana.</p>
<p>Mi mamá es todo: mi maestra, mi doctora y mi amiga más cercana.</p>
<p>En el cielo falta una estrella, la más luminosa, la más bella.</p>
<p>Es mi mamá y soy muy feliz de estar con ella.</p>
            `,
            preguntas: [
                {
                    pregunta: '¿A quién se refiere el cuento?',
                    respuesta1: 'mamá',
                    respuesta2: 'amiga',
                    respuesta3: 'abuela',
                    respuestaCorrecta: 'mamá',
                },
                {
                    pregunta: '¿Cuál es el desayuno que prepara la mamá?',
                    respuesta1: 'huevo',
                    respuesta2: 'fruta',
                    respuesta3: 'cereal con pasas',
                    respuestaCorrecta: 'cereal con pasas',
                },
                {
                    pregunta: '¿Qué es su mamá para ella?',
                    respuesta1: 'secretaria',
                    respuesta2: 'amiga',
                    respuesta3: 'cantante',
                    respuestaCorrecta: 'amiga',
                },
                {
                    pregunta: '¿Cómo se viste la mamá?',
                    respuesta1: 'pantalón de mezclilla',
                    respuesta2: 'traje de pana',
                    respuesta3: 'vestido',
                    respuestaCorrecta: 'traje de pana',
                }
            ]
        },        
        {
            title: 'Abuelita',
            img: 'abuelita.png',
            text: `
            <p>Mi abuelita siempre me besa, a su lado cada día es una sorpresa.</p>
<p>Un día le pregunté: -¿Por qué tu cabello es gris abuelita?</p>
<p>Ella me contestó: -Porque cada cabello blanco es una historia que no debo olvidar.</p>
<p>-¿Esas historias me las vas a contar abuelita?</p>
<p>- Sí, sí, sí. Me respondió. -Y en todas tú vas a estar.</p>
<p>-¿Habrá caballeros, princesas y dragones en esas historias abuelita?</p>
<p>-Claro. Me dijo. -y todas te las voy a contar antes de irte a acostar.</p>
<p>-¿Abuelita, por qué tu voz es bajita y tus manos no pesan?</p>
<p>-Porque yo nunca te voy a gritar y con mis manos sólo te voy a acariciar.</p>
<p>Mi abuelita siempre me besa, a su lado cada día es una sorpresa.</p>
            `,
            preguntas: [
                {
                    pregunta: '¿De qué color es el cabello de la abuelita?',
                    respuesta1: 'negro',
                    respuesta2: 'blanco',
                    respuesta3: 'gris',
                    respuestaCorrecta: 'blanco',
                },
                {
                    pregunta: '¿En las historias que la abuelita contará habrá?',
                    respuesta1: 'magos y ogros',
                    respuesta2: 'princesas y dragones',
                    respuesta3: 'niños y osos',
                    respuestaCorrecta: 'princesas y dragones',
                },
                {
                    pregunta: '¿Por qué la voz de la abuelita es tan bajita?',
                    respuesta1: 'para hablar fuerte',
                    respuesta2: 'para cantar',
                    respuesta3: 'para no gritar',
                    respuestaCorrecta: 'para no gritar',
                },
                {
                    pregunta: '¿Por qué no pesan sus manos?',
                    respuesta1: 'para jugar',
                    respuesta2: 'para coser',
                    respuesta3: 'para acariciar',
                    respuestaCorrecta: 'para acariciar',
                }
            ]
        },        
        {
            title: 'Roco',
            img: 'roco.png',
            text: `
            <p>Roco es de nuestros amigos el mejor</p>
<p>Nos acompaña al parque, a la escuela y al doctor.</p>
<p>Con su nariz fría, busca los aromas de alrededor.</p>
<p>Roco es de nuestros amigos el mejor</p>
<p>De manchas negras de la cabeza hasta el rabo es su color.</p>
<p>Cuando hace frío se recarga para regalarnos calor.</p>
<p>Roco es de nuestros amigos el mejor</p>
<p>Los días soleados lo bañamos con jabón de olor y si lo paseamos camina como un gran señor.</p>
<p>Roco es de nuestros amigos el mejor</p>
<p>Con él jugamos en el patio y en el corredor.</p>
<p>A su lado en las noches nunca sentimos temor.</p>
<p>Roco es de nuestros amigos el mejor</p>
            `,
            preguntas: [
                {
                    pregunta: '¿A dónde acompaña Roco a sus amigos?',
                    respuesta1: 'al parque, escuela y doctor',
                    respuesta2: 'al parque, escuela y mercado',
                    respuesta3: 'al parque, dentista y escuela',
                    respuestaCorrecta: 'al parque, escuela y mercado',
                },
                {
                    pregunta: '¿Con qué bañan a Roco?',
                    respuesta1: 'Champú de olor',
                    respuesta2: 'Jabón de olor',
                    respuesta3: 'Agua y champú',
                    respuestaCorrecta: 'Jabón de olor',
                },
                {
                    pregunta: '¿En dónde juegan con Roco?',
                    respuesta1: 'En el parque y la casa',
                    respuesta2: 'en el patio y el corredor',
                    respuesta3: 'en el patio y el parque',
                    respuestaCorrecta: 'en el patio y el corredor',
                }
            ]
        },        
        {
            title: 'Carmelita',
            img: 'carmelita.png',
            text: `
            <p>Carmelita es una niña de ocho años, es muy inquieta e inteligente.</p>
<p>Con su gran imaginación y sentido musical se ha convertido en una gran escritora.</p>
<p>Le escribe a su familia, amigos y a la naturaleza.</p>
<p>Le gusta leer sus poemas a solas y después compartirlos en familia.</p>
<p>Su talento y gusto por escribir le ayudarán a ser una gran persona.</p>
<p>En la escuela es la primera y en la clase de español, todos la escuchan con gran atención.</p>
<p>Carmelita es de mis amigas la mejor, ella siempre da consejos de mucho valor.</p>
            `,
            preguntas: [
                {
                    pregunta: '¿Cuántos años tiene Carmelita?',
                    respuesta1: 'seis',
                    respuesta2: 'ocho',
                    respuesta3: 'nueve',
                    respuestaCorrecta: 'ocho',
                },
                {
                    pregunta: '¿Qué le gusta hacer a Carmelita?',
                    respuesta1: 'jugar',
                    respuesta2: 'nadar',
                    respuesta3: 'escribir',
                    respuestaCorrecta: 'escribir',
                },
                {
                    pregunta: '¿A quién le escribe Carmelita?',
                    respuesta1: 'familia, maestras',
                    respuesta2: 'familia, naturaleza',
                    respuesta3: 'amigos, doctores',
                    respuestaCorrecta: 'familia, naturaleza',
                },
                {
                    pregunta: '¿Qué escribe Carmelita?',
                    respuesta1: 'cuentos',
                    respuesta2: 'leyendas',
                    respuesta3: 'poemas',
                    respuestaCorrecta: 'poemas',
                }
            ]
        },        
        {
            title: 'Marco',
            img: 'marco.png',
            text: `
            <p>Marco es un niño amable y juguetón, tiene un amigo con el que se divierte mucho, se llama Mauricio. Él es muy bromista y Marco se ríe de sus ocurrencias.</p>
<p>Mauricio es también su compañero en la escuela, por eso todos los días hacen juntos la tarea, luego juegan en las tardes.</p>
<p>Marco quiere ser futbolista en un gran equipo.</p>
<p>A Mauricio le encantan los autos.</p>
<p>Marco y Mauricio comparten juegos y juguetes, se ayudan cuando tienen un problema y respetan los gustos de cada uno.</p>
<p>¡Ellos son grandes amigos!</p>
            `,
            preguntas: [
                {
                    pregunta: '¿Por qué Mauricio es el mejor amigo de Marco?',
                    respuesta1: 'le hace la tarea',
                    respuesta2: 'lo hace reír',
                    respuesta3: 'le compra dulces',
                    respuestaCorrecta: 'lo hace reír',
                },
                {
                    pregunta: '¿Qué quiere ser Marco?',
                    respuesta1: 'doctor',
                    respuesta2: 'maestro',
                    respuesta3: 'futbolista',
                    respuestaCorrecta: 'futbolista',
                },
                {
                    pregunta: '¿Qué son Marco y Mauricio?',
                    respuesta1: 'primos',
                    respuesta2: 'amigos',
                    respuesta3: 'conocidos',
                    respuestaCorrecta: 'amigos',
                },
                {
                    pregunta: '¿Cómo es Marco?',
                    respuesta1: 'amable y juguetón',
                    respuesta2: 'enojón y llorón',
                    respuesta3: 'tímido y callado',
                    respuestaCorrecta: 'amable y juguetón',
                }
            ]
        },        
        {
            title: 'Fer y Lizzy',
            img: 'fer-y-lizy.png',
            text: `
            <p>A Lizzy le gusta estar con Fer.</p>
<p>Juntas juegan como grandes amigas.</p>
<p>Con los juegos de antes todavía se divierten: con el juego del avión y el stop ellas se entretienen.</p>
<p>A la gallinita, buscan a sus amigas a ciegas, y a esconderse si al bote deciden jugar el jueves.</p>
<p>Después de la escuela y de hacer las tareas, al a-mo-a-to y doña Blanca ellas juegan, y con las correteadas los viernes ellas se carcajean.</p>
<p>En el patio o en el parque a ellas les gusta jugar, pues también su cuerpo saben ejercitar.</p>
            `,
            preguntas: [
                {
                    pregunta: '¿Con quién juega Fer?',
                    respuesta1: 'Ana',
                    respuesta2: 'Sofía',
                    respuesta3: 'Lizzy',
                    respuestaCorrecta: 'Lizzy',
                },
                {
                    pregunta: '¿A qué juegan los jueves?',
                    respuesta1: 'congelados',
                    respuesta2: 'al bote',
                    respuesta3: 'Doña Blanca',
                    respuestaCorrecta: 'al bote',
                },
                {
                    pregunta: '¿En dónde juegan?',
                    respuesta1: 'escuela',
                    respuesta2: 'hospital',
                    respuesta3: 'parque',
                    respuestaCorrecta: 'parque',
                },
                {
                    pregunta: '¿Qué hacen los viernes?',
                    respuesta1: 'ver películas',
                    respuesta2: 'jugar a las correteadas',
                    respuesta3: 'nadar',
                    respuestaCorrecta: 'jugar a las correteadas',
                }
            ]
        },        
        {
            title: 'Boltar',
            img: 'boltar.png',
            text: `
            <p>Boltar es muy pequeño aún, pero sabe cuidar y respetar a los animales.</p>
<p>El día de su cumpleaños sus papás le regalaron un perro, al que por su pelo café, lo llamó Canelo.</p>
<p>Canelo siempre sigue a Boltar por donde va, no lo deja solo un instante.</p>
<p>Él se esconde mientras Canelo da vueltas buscándolo, el perro sabe que es un juego y ¡hasta parece que sonríe!</p>
<p>Cuando por fin lo encuentra, Boltar grita de emoción y Canelo salta mientras mueve su cola.</p>
<p>Canelo es muy juguetón, es un perro inteligente y siempre está limpio porque Boltar lo baña y le cepilla su pelo café.</p>
<p>Boltar les dice a sus amigos que a los animales debemos respetar y cuidar, porque son parte de la familia.</p>
<p>Canelo corre por el pasto mientras se agita su pelo con el aire, a Boltar le gusta verlo contento y lo abraza con cariño.</p>
            `,
            preguntas: [
                {
                    pregunta: '¿A qué juega Boltar con su perro?',
                    respuesta1: 'saltar',
                    respuesta2: 'esconderse',
                    respuesta3: 'correr',
                    respuestaCorrecta: 'esconderse',
                },
                {
                    pregunta: '¿Por qué le puso Canelo?',
                    respuesta1: 'porque es grande',
                    respuesta2: 'porque le gusta',
                    respuesta3: 'por su color café',
                    respuestaCorrecta: 'por su color café',
                },
                {
                    pregunta: '¿Por qué le regalaron a Canelo?',
                    respuesta1: 'por su cumpleaños',
                    respuesta2: 'porque se porta bien',
                    respuesta3: 'porque quería un perro',
                    respuestaCorrecta: 'por su cumpleaños',
                }
            ]
        },        
        {
            title: 'Heidi',
            img: 'heidy.png',
            text: `
            <p>Una niña muy linda es Heidi.</p>
<p>Con sus grandes ojos azules, la naturaleza le gusta admirar.</p>
<p>Le gustan las flores y a los animales cuidar.</p>
<p>Aunque es pequeña sabe que a la naturaleza se debe amar y respetar.</p>
<p>Cuando sale de paseo con sus papás, disfruta por el bosque caminar, le gusta oler las flores y escoger las que a mamá le regalará.</p>
<p>Heidi sabe que el mundo natural es nuestro más importante hogar y por ello lo debemos siempre cuidar.</p>
<p>Cuando está con sus amigos ella les invita a conocer lo que la naturaleza nos puede ofrecer.</p>
            `,
            preguntas: [
                {
                    pregunta: '¿De qué color son los ojos de Heidi?',
                    respuesta1: 'café',
                    respuesta2: 'verde',
                    respuesta3: 'azul',
                    respuestaCorrecta: 'azul',
                },
                {
                    pregunta: '¿Qué le gusta a Heidi?',
                    respuesta1: 'libros',
                    respuesta2: 'animales',
                    respuesta3: 'juguetes',
                    respuestaCorrecta: 'animales',
                },
                {
                    pregunta: '¿Qué hace Heidi con sus papás?',
                    respuesta1: 'caminar por el bosque',
                    respuesta2: 'leer poemas',
                    respuesta3: 'cocinar papas',
                    respuestaCorrecta: 'caminar por el bosque',
                },
                {
                    pregunta: '¿Qué le regala Heidi a su mamá?',
                    respuesta1: 'comida',
                    respuesta2: 'flores',
                    respuesta3: 'dulces',
                    respuestaCorrecta: 'flores',
                },
                {
                    pregunta: '¿Cuál es el más importante hogar para Heidi?',
                    respuesta1: 'escuela',
                    respuesta2: 'casa de su tia',
                    respuesta3: 'el mundo natural',
                    respuestaCorrecta: 'el mundo natural',
                }
            ]
        },        
        {
            title: 'Los primos',
            img: 'primos.png',
            text: `
            <p>Rodrigo, Erik, Geraldine, Jaime y Gabo son primos de verdad.</p>
<p>Cuando llega la hora de jugar, todoas quieren participar y cuando los juguetes deben levantar todoas comienzan a ayudar.</p>
<p>Cuando tienen algún problema, todoas saben apoyar, pues en su familia les enseñaron a ayudar.</p>
<p>Rodrigo, Erik, Geraldine, Jaime y Gabo son primos y amigos de verdad, y como grandes compañeroas, todo su amor y apoyo saben dar.</p>
<p>Cuando a sus amigos invitan a jugar, ellos comparten sus juegos y se divierten sin parar.</p>
            `,
            preguntas: [
                {
                    pregunta: '¿Rodrigo, Erik, Jaime y Gabo son?',
                    respuesta1: 'hermanos',
                    respuesta2: 'conocidos',
                    respuesta3: 'primos',
                    respuestaCorrecta: 'primos',
                },
                {
                    pregunta: '¿Qué hacen cuando hay problemas?',
                    respuesta1: 'llorar',
                    respuesta2: 'apoyar',
                    respuesta3: 'dormir',
                    respuestaCorrecta: 'apoyar',
                },
                {
                    pregunta: '¿Además de primos qué son?',
                    respuesta1: 'amigos',
                    respuesta2: 'hermanos',
                    respuesta3: 'conocidos',
                    respuestaCorrecta: 'amigos',
                }
            ]
        }
    ];
}