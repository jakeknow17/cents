FROM mcr.microsoft.com/openjdk/jdk:21-azurelinux AS build

WORKDIR /app

COPY gradlew .
COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY gradle/ gradle/
COPY buildSrc/ buildSrc/

COPY src/ src/

RUN chmod +x gradlew
RUN ./gradlew build -x test

FROM mcr.microsoft.com/openjdk/jdk:21-azurelinux

WORKDIR /app

# Copy the built JAR from build stage
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
