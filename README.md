# Snake3D

3D snake game with WebGL


## Init

Create database (sqlite, mysql, ...)

Copy `config.example.php` to `config.php` and adapt.

```sql
CREATE TABLE `snake3d-scores` (`name` TEXT, `score` INT);
INSERT INTO `snake3d-scores` (`name`, `score`) VALUES ('jojo', 12);
```