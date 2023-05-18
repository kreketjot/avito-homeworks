#
# Build stage
#
FROM maven:3.9 AS build
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package

#
# Package stage
#
FROM openjdk
WORKDIR /app
COPY --from=build /home/app .
EXPOSE 3002 
CMD ["java","-cp","target/auth-1.0-SNAPSHOT-jar-with-dependencies.jar","src/main/java/ru/kreketjot/GrpcServer.java"]