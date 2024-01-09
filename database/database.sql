create database proyectodb;

use proyectodb;

create table documentos (
    id int primary key auto_increment,
    nombre varchar(255) not null,
    parametros varchar(255) not null,
    ruta varchar(255) not null
);

create table tipos (
    id int primary key auto_increment,
    tipo varchar(255) not null
);

create table esTipo (
    id_documento int,
    id_tipo int,
    foreign key (id_documento) references documentos(id),
    foreign key (id_tipo) references tipos(id)
);

insert into tipos (tipo) values ('word'), ('excel'), ('pdf');

insert into documentos (nombre, parametros, ruta) values ('prueba', 'NOMBRE', './../archivos/res_reporte1.docx');

SET @id_documento = LAST_INSERT_ID();
SET @id_tipo1 = LAST_INSERT_ID();

insert into esTipo (id_documento, id_tipo) values (@id_documento, @id_tipo1);

insert into documentos (nombre, parametros, ruta) values ('prueba2', 'LUGAR', './../archivos/plantilla.docx');