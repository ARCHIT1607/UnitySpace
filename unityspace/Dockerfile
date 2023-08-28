# Stage 1: Build the application
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
ARG DB_URL
ARG DB_NAME
ARG DB_USER
ARG DB_PASSWORD
RUN mvn clean package -DskipTests
COPY src ./src
RUN mvn package -DskipTests --build-arg DB_URL=$DB_URL --build-arg DB_NAME=$DB_NAME --build-arg DB_USER=$DB_USER --build-arg DB_PASSWORD=$DB_PASSWORD

# Stage 2: Create the final image
FROM openjdk:17-jdk-slim
ARG JAR_FILE=/app/target/*.jar
COPY --from=build ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]