# BackEnd — local dev notes

Đã thực hiện các thay đổi sau trong nhánh `ci/fix-tests-h2`:

- Thêm dependency `com.h2database:h2` (scope `test`) để chạy unit/integration tests bằng in-memory DB.
- Cập nhật `java.version` thành `17` để khớp với JDK cục bộ (OpenJDK 17).
- Thay đổi phiên bản driver PostgreSQL thành `42.5.4` để tránh lỗi resolution cached.

How to run tests

```powershell
Push-Location 'D:\logistic-free-map\BackEnd'
.\mvnw.cmd test
Pop-Location
```

How to build artifact (skip tests)

```powershell
Push-Location 'D:\logistic-free-map\BackEnd'
.\mvnw.cmd -DskipTests package
Pop-Location
```

Run the jar locally using an in-memory H2 datasource (overrides `application.properties`):

```powershell
Push-Location 'D:\logistic-free-map\BackEnd'
java -jar target\backend-0.0.1-SNAPSHOT.jar "--spring.datasource.url=jdbc:h2:mem:prodrun;DB_CLOSE_DELAY=-1;MODE=PostgreSQL" --spring.datasource.username=sa --spring.datasource.password= --spring.jpa.hibernate.ddl-auto=update
Pop-Location
```

If you want to run against a real PostgreSQL instance:

- Ensure PostgreSQL is running and `application.properties` has correct `spring.datasource.url`, `username` and `password`.
- Optionally, install JDK 21 and set `java.version` back to `21` in `pom.xml` if you prefer matching Spring Boot recommendations.

 Suggested next steps

 - Push branch to remote and open a PR, or keep branch locally if you prefer.
 - Revert `java.version` to `21` only after installing JDK21 on the machine.

 Docker and CI

 - Dockerfile: a multi-stage Dockerfile is added at `BackEnd/Dockerfile`. Build and run locally:

 ```powershell
 Push-Location 'D:\logistic-free-map\BackEnd'
 docker build -t backend:local .
 docker run --rm -p 8081:8081 backend:local
 Pop-Location
 ```

 - CI workflow: GitHub Actions workflow added at `.github/workflows/ci.yml`. It runs tests with JDK17 and builds a Docker image (does not push).

 Notes

 - Branch: `ci/fix-tests-h2` contains changes (H2 dev profile, Java 17 target, Dockerfile, CI workflow). The branch is currently local; push when ready.

Install JDK 17 (Windows)

1. Download Temurin JDK 17 (or another JDK 17 distribution):

	- Temurin: https://adoptium.net
	- Azul Zulu: https://www.azul.com/downloads/

2. Install and set `JAVA_HOME` (PowerShell example):

```powershell
# After installing JDK17, set JAVA_HOME (change path to your install folder)
$env:JAVA_HOME = 'C:\Program Files\Eclipse Adoptium\jdk-17'
[Environment]::SetEnvironmentVariable('JAVA_HOME', $env:JAVA_HOME, 'User')
# Add to PATH for current session
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path
```

3. Verify:

```powershell
java -version
```

Run application in dev profile (use embedded H2)

```powershell
Push-Location 'D:\logistic-free-map\BackEnd'
# Using Maven (preferred for development):
.\mvnw.cmd -DskipTests -Dspring-boot.run.profiles=dev spring-boot:run

# Or run jar (ensure you built with a JDK that supports the project java.version):
java -jar target\backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
Pop-Location
```

Notes

- The project now targets **Java 17** (`<java.version>17` in `pom.xml`). Your local OpenJDK 17 installation matches this, so builds and runs should work without installing a new JDK.
- The `application-dev.properties` file configures H2 (PostgreSQL compatibility mode) for fast local development; the default profile is `dev` so local runs use H2 by default.



