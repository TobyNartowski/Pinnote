# <img src="/.design/logo_pin_color.png" height="27"> Pinnote
Quick and simple online pinboard where you can easily create new notes and search through them by tags. 

## What's inside
Project is based on Spring Boot and uses following technologies:
* Java 11
* Spring Framework
	* Spring Core
	* Spring Boot
	* Spring Data
	* Spring MVC
	* Spring Security
* Thymeleaf
* JUnit / Mockito
* Hibernate / MySQL
* HTML / CSS / Javascript + Jquery / Bootstrap

## Instalation
Pinnote is created with Maven, therefore running project is very easy and is based on configuration of database settings and running a mvn command in command line. Database settings are located  in `resources/application.properties`. The default ones which you have to change are:

```
# Datasource
spring.datasource.url=jdbc:mysql://localhost:3306/pinnote?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
```

After configuration of database, just run following command in root directory of the project:
```
mvn spring-boot:run
```

## Functionality
Pinnote provides functionality of quick adding, deleting, viewing and effective filtering your notes. 

<div style="text-align:center;">
	<img src="/.design/gif.gif" />
</div>
