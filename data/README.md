# Foxhole datamining input

Положите сюда файлы:

- `catalog.json`
- `fs_vanilla.h5` — если файл содержит JSON-фрагмент/текстовый экспорт, импортёр его распознает;

Затем из корня проекта выполните:

```bash
node scripts/import-foxhole-data.mjs
```

Импортёр создаст/обновит:

```text
src/lib/foxhole-data.ts
```

Данные подключаются к:

- `getItemIconPath()` и поиску игровых иконок;
- parser/совпадению кодов и названий;
- вкладке «База кодов».

Скрипт не хранит секреты и не меняет схему PostgreSQL.
