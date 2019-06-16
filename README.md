# where-in-json
A JavaScript library to convert a json filter to SQL Where Clause.

### How to use
```javascript
const parser = require('where-in-json');
```

### Example 1
```javascript
const filter = {
    name: 'John',
    email: 'John@doe.com',
    contactNo: 1231231230
};

console.log(parser.toWhereClause(filter));

//OUTPUT: name='John' AND email='John@doe.com' AND contactNo=1231231230
```

### Example 2
```javascript
const filter = {
    $and: [
        { name: 'John' },
        {
            $or: [
                { email: 'John@doe.com' },
                { contactNo: 1231231230 }
            ]
        }
    ]
};

console.log(parser.toWhereClause(filter));

//OUTPUT: (name='John' AND (email='John@doe.com' OR contactNo=1231231230))
```

### Example 3
```javascript
const filter = {
    name: 'John',
    $or: [
        {
            email: {
                $ne: 'John@doe.com'
            }
        },
        { contactNo: 1231231230 }
    ]
};

console.log(parser.toWhereClause(filter));

//OUTPUT: name='John' AND (email <> 'John@doe.com' OR contactNo=1231231230)
```

### Example 4
```javascript
const filter = {
    name: 'John',
    age: {
        $and: [
            { $gte: 18 },
            { $lte: 25 }
        ]
    }
};

console.log(parser.toWhereClause(filter));

//OUTPUT: name='John' AND (age >= 18 AND age <= 25)
```

### Example 5
```javascript
const filter = {
    $and: [
        { name: 'John' },
        {
            age: { $gte: 18 }
        },
        {
            age: { $lte: 25 }
        }
    ]
};

console.log(parser.toWhereClause(filter));

//OUTPUT: (name='John' AND age >= 18 AND age <= 25)
```