DROP DATABASE IF EXISTS FamilyTree;
CREATE DATABASE FamilyTree;
USE FamilyTree;

CREATE TABLE People (
  Person_Id INT PRIMARY KEY,
  Personal_Name VARCHAR(100),
  Family_Name VARCHAR(100),
  Gender ENUM('Male', 'Female'),
  Father_Id INT,
  Mother_Id INT,
  Spouse_Id INT,
  FOREIGN KEY (Father_Id) REFERENCES People(Person_Id),
  FOREIGN KEY (Mother_Id) REFERENCES People(Person_Id),
  FOREIGN KEY (Spouse_Id) REFERENCES People(Person_Id)
);

-- הכנסת נתונים לצורך בחינת המימוש --------------------------------------
INSERT INTO People (Person_Id, Personal_Name, Family_Name, Gender, Father_Id, Mother_Id, Spouse_Id) VALUES
(1, 'David', 'Cohen', 'Male', NULL, NULL, NULL),
(2, 'Sarah', 'Cohen', 'Female', NULL, NULL, NULL),
(3, 'Michael', 'Cohen', 'Male', 1, 2, NULL),
(4, 'Yael', 'Cohen', 'Female', 1, 2, NULL),
(5, 'Eli', 'Levi', 'Male', NULL, NULL, NULL),
(6, 'Noa', 'Levi', 'Female', NULL, NULL, NULL),
(7, 'Dana', 'Levi', 'Female', 5, 6, NULL),
(8, 'Amit', 'Cohen', 'Male', 3, 4, NULL),
(9, 'Lior', 'Levi', 'Male', 5, 6, NULL);

-- לאחר מכן, צור את הקשרים בין בני הזוג
UPDATE People SET Spouse_Id = 2 WHERE Person_Id = 1;
UPDATE People SET Spouse_Id = 1 WHERE Person_Id = 2;

UPDATE People SET Spouse_Id = 6 WHERE Person_Id = 5;
UPDATE People SET Spouse_Id = 5 WHERE Person_Id = 6;

UPDATE People SET Spouse_Id = 9 WHERE Person_Id = 8;

-- תרגיל 2 השלמת בני/בנות זוג חסרים (תרגיל 1 מופיע בהמשך)
UPDATE People p1
JOIN People p2 ON p1.Spouse_Id = p2.Person_Id
SET p2.Spouse_Id = p1.Person_Id
WHERE p2.Spouse_Id IS NULL;

-- תרגיל 1--------------------------------------
CREATE TABLE Family_Tree (
    Person_Id INT,
    Relative_Id INT,
    Connection_Type ENUM(
        'Father',    -- אב
        'Mother',    -- אם
        'Brother',   -- אח
        'Sister',    -- אחות
        'Son',       -- בן
        'Daughter',  -- בת
        'Husband',   -- בן זוג
        'Wife'       -- בת זוג
    ) NOT NULL,
    FOREIGN KEY (Person_Id) REFERENCES People(Person_Id),
    FOREIGN KEY (Relative_Id) REFERENCES People(Person_Id),
    UNIQUE (Person_Id, Relative_Id, Connection_Type)
);
-- קשרים עם אב
INSERT INTO Family_Tree (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Father_Id, 'Father'
FROM People
WHERE Father_Id IS NOT NULL;

-- קשרים עם אם
INSERT INTO Family_Tree (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Mother_Id, 'Mother'
FROM People
WHERE Mother_Id IS NOT NULL;

-- יצירת קשרים בין בני זוג לפי המגדר של בן/בת הזוג
INSERT INTO Family_Tree (Person_Id, Relative_Id, Connection_Type)
SELECT p1.Person_Id, p2.Person_Id,
       CASE
           WHEN p2.Gender = 'Male' THEN 'Husband'
           WHEN p2.Gender = 'Female' THEN 'Wife'
       END
FROM People p1
JOIN People p2 ON p1.Spouse_Id = p2.Person_Id
WHERE p1.Spouse_Id IS NOT NULL;

-- קשרים בין אחים ואחיות:
INSERT INTO Family_Tree (Person_Id, Relative_Id, Connection_Type)
SELECT p1.Person_Id, p2.Person_Id,
       CASE
           WHEN p2.Gender = 'Male' THEN 'Brother'
           WHEN p2.Gender = 'Female' THEN 'Sister'
       END
FROM People p1
JOIN People p2
    ON p1.Person_Id != p2.Person_Id
   AND (
       (p1.Father_Id IS NOT NULL AND p1.Father_Id = p2.Father_Id) OR
       (p1.Mother_Id IS NOT NULL AND p1.Mother_Id = p2.Mother_Id)
   );

-- קשרים מהורה לילד (בן או בת)
INSERT INTO Family_Tree (Person_Id, Relative_Id, Connection_Type)
SELECT Father_Id, Person_Id,
       CASE WHEN Gender = 'Male' THEN 'Son' ELSE 'Daughter' END
FROM People
WHERE Father_Id IS NOT NULL;

INSERT INTO Family_Tree (Person_Id, Relative_Id, Connection_Type)
SELECT Mother_Id, Person_Id,
       CASE WHEN Gender = 'Male' THEN 'Son' ELSE 'Daughter' END
FROM People
WHERE Mother_Id IS NOT NULL;

-- צפייה בנתוני בטבלה החדשה--------------------------------------
SELECT * FROM Family_Tree;