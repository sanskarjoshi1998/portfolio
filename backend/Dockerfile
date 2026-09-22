# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build

# Cache dependencies separately from source so code changes don't force a re-download
COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -B

# ---- Runtime stage ----
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Run as non-root for security
RUN groupadd -r spring && useradd -r -g spring spring
USER spring:spring

COPY --from=build /build/target/portfolio-app.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
