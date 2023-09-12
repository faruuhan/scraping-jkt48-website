# SCRAPING JKT48 WEBSITE

scraping JKT48 website API

## Usage

1. Clone this repository
   ```bash
   git clone https://github.com/faruuhan/scraping-jkt48-website.git
   ```
2. Install dependecies (`yarn install`)
3. Start the development environment
   ```bash
   yarn run dev
   ```
4. visit http://localhost:8000/

## API Reference

#### Get all schedule

```http
  GET /api/schedule
```

#### Get detail schedule

```http
  GET /api/schedule/:idschedule
```

| Parameter    | Type     | Description                       |
| :----------- | :------- | :-------------------------------- |
| `idschedule` | `number` | **Required**. Id of item to fetch |

#### Get all list member

```http
  GET /api/member/
```

#### Get detail member

```http
  GET /api/member/:idmember
```

| Parameter  | Type     | Description                       |
| :--------- | :------- | :-------------------------------- |
| `idmember` | `number` | **Required**. Id of item to fetch |
