# Roadmap

# SourceResume

## Thanks

[Resume-Schema](https://github.com/jsonresume/resume-schema)



| 字段名 | 类型 | 描述 |
| --- | --- | --- |
| id | TEXT | 主键 |
| resume_id | TEXT | 非空，外键，引用 RESUME_META 表的 id |
| image | TEXT | 非空 |
| create_at | DATETIME |  |
| update_at | DATETIME |  |
