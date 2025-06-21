# intro

## Why do we need a DBMS (Database Management System)?

- Store huge amount of data (e.g., TB+) over a long period of time
- Allow apps to query and update data
  - Query: what is Mary’s grade in the “Operating System” course?
  - Update: enroll Mary in the “Database” course
- Protect from unauthorized access.
  - Students cannot change their course grades.
- Protect from system crashes
  - When some system components fail (hard drive, network, etc.),
    database can be restored to a good state.

## More on what can DBMS do for applications?

- Protect from incorrect inputs
  - Mary has registered for 100 courses
- Support concurrent access from multiple users
  - 1000 students using the registration system at the
    same time
- Allow administrators to easily change data
  - schema
    - At a later time, add TA info to courses.
- Efficient database operations
  - Search for students with 5 highest GPAs
