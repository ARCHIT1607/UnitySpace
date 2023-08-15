FROM openjdk:17-jdk-alpine
RUN apk update && apk add --no-cache maven
WORKDIR /app
COPY . .
RUN mvn package clean -DskipTests
COPY target/unityspace-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]