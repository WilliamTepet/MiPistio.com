insert into mipistio_catalogo.catalogo values (nextval('s_catalogo'),NULL,'estados','Catalogo de Estados',1.0,'Admin',
'Admin','2020-03-19 00:00:00','2020-03-19 00:00:00','192.168.1.2','192.168.1.2')


CREATE SEQUENCE s_catalogo2
INCREMENT 1 
START 1;

CREATE SEQUENCE s_id_empleado_pto_atencion
INCREMENT 1 
START 1	;

select PA.nombre, CU.id_usuario, CPA.cod_cargo, CU.email, CU.cui
from mipistio_catalogo.cat_punto_atencion PA
join mipistio_catalogo.cat_usuario_punto_atencion CPA on CPA.cod_punto_atencion = PA.id_punto_atencion
join mipistio_catalogo.cat_usuarios CU on CU.id_usuario = CPA.cod_usuario
where cui = 'AA-123' or email = '1359llbb.outlook.com';

select CU.cui, CU.nombre, CU.email, CU.estado, CU.cod_rol, PA.nombre as punto, CPA.cod_cargo
        from mipistio_catalogo.cat_punto_atencion PA
        join mipistio_catalogo.cat_usuario_punto_atencion CPA on CPA.cod_punto_atencion = PA.id_punto_atencion
        join mipistio_catalogo.cat_usuarios CU on CU.id_usuario = CPA.cod_usuario;

insert into mipistio_catalogo.cat_usuarios values (nextval('s_id_usuario'),'2222-2356','Axel','axael@gmail.com',1,2,3,'Admin','Admin','2020-03-20 00:00:00','2020-03-20 00:00:00','192.168.1.1','192.168.1.1','axel2020');
insert into mipistio_catalogo.cat_usuario_punto_atencion values (nextval('s_usuario_p_atencion'),(select currval ('s_id_usuario')),1);
select currval ('s_id_usuario');


insert into mipistio_catalogo.cat_usuario_punto_atencion values (13,49,1,7);

update estado
from mipistio_catalogo.cat_usuarios
where cui = '12345-9876'



update mipistio_catalogo.cat_usuarios
set cui = '12345-678', nombre = 'aocox', email='12345-67899@outlook.es', estado = 2, cod_rol = 2, cod_cargo = 1, usuario_modifica = 'Admin2', fecha_modifica = '2020-03-22 00:00:00', ip_modifica = '192.168.1.10', password = '09987'
where id_usuario = 37;
update mipistio_catalogo.cat_usuario_punto_atencion
set cod_cargo = 7
where cod_usuario = 37;


select nombre 
from mipistio_catalogo.catalogo

insert into mipistio_catalogo.catalogo_dato values (11,2,'Jefe',1,'Catalogo de usuarios encargados','admin','admin','2020-03-18 00:00:00','2020-03-18 00:00:00','192.168.1.1','192.168.1.1')

insert into mipistio_catalogo.cat_usuario_punto_atencion values (nextval('s_usuario_p_atencion'),49,3,11);


select CU.id_usuario,  PA.nombre, CPA.cod_cargo
from mipistio_catalogo.cat_punto_atencion PA
join mipistio_catalogo.cat_usuario_punto_atencion CPA on CPA.cod_punto_atencion = PA.id_punto_atencion
join mipistio_catalogo.cat_usuarios CU on CU.id_usuario = CPA.cod_usuario
where cui = '12345-678' and CPA.cod_punto_atencion = 1;


select CU.id_usuario, PA.nombre, CU.email
from mipistio_catalogo.cat_punto_atencion PA
join mipistio_catalogo.cat_usuario_punto_atencion CPA on CPA.cod_punto_atencion = PA.id_punto_atencion
join mipistio_catalogo.cat_usuarios CU on CU.id_usuario = CPA.cod_usuario
where cui = '123-181920' and cast (CPA.cod_cargo as varchar) not like '22';

select CU.id_usuario, PA.nombre, CU.email
from mipistio_catalogo.cat_punto_atencion PA
join mipistio_catalogo.cat_usuario_punto_atencion CPA on CPA.cod_punto_atencion = PA.id_punto_atencion
join mipistio_catalogo.cat_usuarios CU on CU.id_usuario = CPA.cod_usuario
where cui = '123-181920' and CPA.cod_cargo < 22;


select cod_usuario, cod_punto_atencion, cod_cargo
from mipistio_catalogo.cat_usuario_punto_atencion
where cod_usuario = 84 and cod_punto_atencion = 2;

select cod_usuario, cod_punto_atencion, cod_cargo
from mipistio_catalogo.cat_usuario_punto_atencion
where cod_usuario = 84 and cod_cargo <11 ;


select id_usuario
from mipistio_catalogo.cat_usuarios
where email = '1359llbb.outlook.com';

select id_usuario
from mipistio_catalogo.cat_usuarios
where cui = '123-181920';


select CU.cui, CU.nombre, CU.email, CU.estado, CU.cod_rol, PA.nombre, CPA.cod_cargo
from mipistio_catalogo.cat_punto_atencion PA
join mipistio_catalogo.cat_usuario_punto_atencion CPA on CPA.cod_punto_atencion = PA.id_punto_atencion
join mipistio_catalogo.cat_usuarios CU on CU.id_usuario = CPA.cod_usuario


--busqueda de rol por email
select CU.cui, CU.nombre, CU.estado, CU.cod_rol, CU.id_usuario
from mipistio_catalogo.cat_punto_atencion PA
join mipistio_catalogo.cat_usuario_punto_atencion CPA on CPA.cod_punto_atencion = PA.id_punto_atencion
join mipistio_catalogo.cat_usuarios CU on CU.id_usuario = CPA.cod_usuario
where CU.email = 'djfdlka@gmail.com' and CU.password = '123456';

--insert de queja
insert into mipistio_catalogo.queja values (nextval('s_id_queja'),concat('QMS-', cast(nextval('s_cod_queja') as varchar),'-2020'),'Cliente 1','cliente1@gmail.com',12340987,
	'MiPistio Central','panda','Creación de queja prueba 1','Presentada','Presentada','Menu Aplicacion',27,'QMS','','2020-04-12 18:30:00', '2020-04-12 18:30:00','pedro','pedro');
insert into mipistio_catalogo.queja_usuario values (nextval('s_usuario_queja'),(select currval ('s_cod_queja')),105);

--obtiene ultimo registro de queja
select id_queja, codigo
from mipistio_catalogo.queja
order by id_queja desc
limit 1;


--consulta para listar empleados
select nombre, cui, cod_empleado, estado
from mipistio_catalogo.cat_empleados;


--actualiza datos de queja
update mipistio_catalogo.queja
set nombre_cliente = 'Prueba QMS 37', email = 'prueba37@gmail.com', telefono = 10988271, punto_atencion = 'Mi Pistio Sur', nombre_empleado = 'Juan Lopez', descripcion = 'Prueba 37',  archivo = '', fecha_modifica = '2020-03-22 00:00:00', usuario_modifica = 'Lucas Chavez'
where id_queja = 37;
update mipistio_catalogo.queja_dato
set cod_tipo_queja = 32, cod_estado_externo = 35, cod_estado_interno = 37, cod_tipo_ingreso = 39, cod_medio_ingreso = 28
where cod_queja = 37;

select * from mipistio_catalogo.queja_dato;
select * from mipistio_catalogo.queja;