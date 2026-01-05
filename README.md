# My Angular App

Angular project with integrated **SonarQube** (code quality) and **Snyk** (security scanning).

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Local Setup](#local-setup)
  - [SonarQube Local Setup](#sonarqube-local-setup)
  - [Snyk Local Setup](#snyk-local-setup)
- [Running Scans Locally](#running-scans-locally)
- [CI/CD Integration](#cicd-integration)
  - [GitHub Actions Setup](#github-actions-setup)
  - [GitLab CI Setup](#gitlab-ci-setup)
- [Configuration Files](#configuration-files)
- [Failing the Build on Issues](#failing-the-build-on-issues)
- [Quality Gates](#quality-gates)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js** 20.x or higher
- **npm** 10.x or higher
- **Docker** (for local SonarQube)
- **Angular CLI**: `npm install -g @angular/cli`
- **Snyk CLI**: `npm install -g snyk`
- **SonarQube Scanner**: `npm install -g sonarqube-scanner`

---

## Quick Start

```bash
# Install dependencies
npm install

# Run the app
npm start

# Run all quality checks
npm run ci:quality
```

---

## Local Setup

### SonarQube Local Setup

#### Option 1: Docker (Recommended)

```bash
# Start SonarQube server
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest

# Wait for it to start (about 1-2 minutes)
# Access at http://localhost:9000
# Default credentials: admin/admin
```

#### Option 2: Docker Compose

Create `docker-compose.sonar.yml`:

```yaml
version: "3"
services:
  sonarqube:
    image: sonarqube:latest
    ports:
      - "9000:9000"
    environment:
      - SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true
    volumes:
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_logs:/opt/sonarqube/logs
      - sonarqube_extensions:/opt/sonarqube/extensions

volumes:
  sonarqube_data:
  sonarqube_logs:
  sonarqube_extensions:
```

```bash
docker-compose -f docker-compose.sonar.yml up -d
```

#### Generate SonarQube Token

1. Go to http://localhost:9000
2. Login with `admin/admin`
3. Go to **My Account** → **Security** → **Generate Tokens**
4. Create a token named `angular-project`
5. Copy the token

#### Configure Project

Update `sonar-project.properties`:

```properties
sonar.host.url=http://localhost:9000
sonar.token=YOUR_TOKEN_HERE
```

Or use environment variables:

```bash
export SONAR_HOST_URL=http://localhost:9000
export SONAR_TOKEN=your-token-here
```

---

### Snyk Local Setup

#### 1. Create Snyk Account

- Go to [snyk.io](https://snyk.io) and sign up (free for open source)

#### 2. Authenticate CLI

```bash
# Interactive authentication (opens browser)
snyk auth

# Or use token directly
snyk auth YOUR_SNYK_TOKEN
```

#### 3. Get Your API Token

1. Login to [app.snyk.io](https://app.snyk.io)
2. Go to **Account Settings**
3. Copy your **API Token**

---

## Running Scans Locally

### 📊 All Quality Checks

```bash
# Run lint + tests + SonarQube
npm run ci:quality
```

### 🔍 Linting Only

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### 🧪 Tests with Coverage

```bash
# Run tests with coverage report
npm run test:ci

# Coverage report will be in: coverage/my-angular-app/
```

### 📈 SonarQube Analysis

```bash
# Run SonarQube scan
npm run sonar

# Or with explicit settings
npx sonar-scanner \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=YOUR_TOKEN
```

### 🔐 Snyk Security Scans

```bash
# Test dependencies for vulnerabilities
npm run snyk:test
# or
snyk test

# Test with severity filter (only high/critical)
snyk test --severity-threshold=high

# Test and fail on fixable issues
snyk test --fail-on=upgradable

# Monitor project (sends to Snyk dashboard)
npm run snyk:monitor
# or
snyk monitor

# Code analysis (SAST)
snyk code test

# Container scanning (if using Docker)
snyk container test your-image:tag
```

---

## CI/CD Integration

### GitHub Actions Setup

#### Required Secrets

Go to **Repository Settings** → **Secrets and variables** → **Actions**:

| Secret Name | Description |
|-------------|-------------|
| `SONAR_TOKEN` | SonarQube/SonarCloud authentication token |
| `SONAR_HOST_URL` | SonarQube server URL (e.g., http://your-server:9000) |
| `SONAR_ORGANIZATION` | SonarCloud organization (if using SonarCloud) |
| `SNYK_TOKEN` | Snyk API token |
| `SNYK_ORG` | Snyk organization ID |

#### Workflow File Location

`.github/workflows/ci.yml` is already configured.

#### Using SonarCloud Instead

1. Go to [sonarcloud.io](https://sonarcloud.io)
2. Import your repository
3. Get organization key and project key
4. Uncomment the SonarCloud section in the workflow

---

### GitLab CI Setup

#### Required Variables

Go to **Settings** → **CI/CD** → **Variables**:

| Variable | Description | Protected | Masked |
|----------|-------------|-----------|--------|
| `SONAR_TOKEN` | SonarQube token | ✅ | ✅ |
| `SONAR_HOST_URL` | SonarQube URL | ✅ | ❌ |
| `SNYK_TOKEN` | Snyk API token | ✅ | ✅ |
| `SNYK_ORG` | Snyk organization | ✅ | ❌ |

#### Pipeline File Location

`.gitlab-ci.yml` is already configured.

---

## Configuration Files

| File | Purpose |
|------|---------|
| `sonar-project.properties` | SonarQube project configuration |
| `.snyk` | Snyk policy (ignore rules, patches) |
| `.snyk.json` | Snyk JSON configuration |
| `eslint.config.js` | ESLint rules and configuration |
| `karma.conf.js` | Test runner with coverage reporting |
| `.github/workflows/ci.yml` | GitHub Actions pipeline |
| `.gitlab-ci.yml` | GitLab CI pipeline |

---

## Failing the Build on Issues

### ESLint

The pipeline fails if any ESLint errors exist:

```yaml
- name: Run linting
  run: npm run lint
  continue-on-error: false  # Fail on errors
```

### Test Coverage

Karma is configured to fail if coverage drops below 80%:

```javascript
// karma.conf.js
coverageReporter: {
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
```

### SonarQube Quality Gate

The pipeline waits for Quality Gate and fails if not passed:

```yaml
- name: SonarQube Quality Gate
  uses: sonarsource/sonarqube-quality-gate-action@master
```

### Snyk Vulnerabilities

Snyk fails the build on high/critical vulnerabilities:

```yaml
- name: Run Snyk
  with:
    args: --severity-threshold=high --fail-on=all
```

---

## Quality Gates

### SonarQube Default Quality Gate

| Metric | Condition |
|--------|-----------|
| Coverage on new code | ≥ 80% |
| Duplicated lines on new code | ≤ 3% |
| Maintainability Rating | A |
| Reliability Rating | A |
| Security Rating | A |
| Security Hotspots Reviewed | 100% |

### Snyk Thresholds

| Severity | Action |
|----------|--------|
| Critical | ❌ Fail build |
| High | ❌ Fail build |
| Medium | ⚠️ Warning |
| Low | ℹ️ Info |

---

## Troubleshooting

### SonarQube Issues

**"Not authorized" error:**
```bash
# Check your token
export SONAR_TOKEN=your-token
npx sonar-scanner
```

**No coverage in report:**
```bash
# Run tests first with coverage
npm run test:ci
# Then run SonarQube
npm run sonar
```

**Quality Gate timeout:**
```bash
# Increase timeout or check webhook configuration
sonar-scanner -Dsonar.qualitygate.timeout=300
```

### Snyk Issues

**Authentication failed:**
```bash
# Re-authenticate
snyk auth

# Or set token directly
export SNYK_TOKEN=your-token
```

**No vulnerabilities found (but expected):**
```bash
# Make sure node_modules exists
npm install
snyk test
```

**Ignore false positives:**
```bash
# Add to .snyk file
snyk ignore --id=SNYK-JS-EXAMPLE-123456 --reason="False positive"
```

### GitHub Actions Issues

**Secrets not available:**
- Ensure secrets are set in repository settings
- Check if workflow has access to secrets (fork restrictions)

### GitLab CI Issues

**Cache not working:**
```yaml
# Clear cache and rebuild
cache:
  policy: pull-push
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run tests in watch mode |
| `npm run test:ci` | Run tests once with coverage |
| `npm run lint` | Check for linting issues |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run sonar` | Run SonarQube analysis |
| `npm run snyk:test` | Test for vulnerabilities |
| `npm run snyk:monitor` | Monitor project in Snyk |
| `npm run ci:quality` | Run all quality checks |

---

## License

MIT

