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

