## sequelize-typescript-exports
![Build Status](https://img.shields.io/github/workflow/status/oppossome/sequelize-typescript-exports/Build%20Checks) 
![Code Coverage](https://img.shields.io/codecov/c/github/oppossome/sequelize-typescript-exports) 


# Installation
This assumes you have successfully installed [sequelize-typescript](https://github.com/RobinBuschmann/sequelize-typescript#installation)

```sh
npm install sequelize-typescript-exports
```

# Models
Aside from minor changes, it works the same as [sequelize-typescript models](https://github.com/RobinBuschmann/sequelize-typescript#usage)


## Model Declarations
In order to utilize `@Exportable` you must extend from `ExportableModel` class it's a drop in replacement for sequelize-typescript's `Model`

```ts
@Table
export class User extends ExportableModel {
    @Column
    name: string;

    //...
}
```

## ExportRule
Rules are what define whether or not a field it's assigned to is exported only determining what happens if it returns a Export enum

```ts
const OnlySelf: ExportRule = (input: any, caller: ExportableModel) => {
    if (input instanceof User) {
        if(input.name === (caller as User).name) {
            return Export.Allowed
        }
    }
}

const IsntDave: ExportRule = (input: any, caller: ExportableModel) => {
    if (input instanceof User) {
        if (input.name === "Dave") {
            return Export.Denied
        }
    }
}
```

## @Exportable
Assigned to a field within a ExportableModel, it takes an array of [Export Rules](#exportrule) and executes them sequentially upon model export


```ts
@Table
export class User extends ExportableModel {
    // Always export this value, Export enums can be used as Rules
    @Exportable([Export.Allowed]) 
    @Column
    name: string;

    // Call the method defined in the ExportRule section
    @Exportable([OnlySelf]) 
    @Column
    session_token: string;

    // Allow any export that isn't blocked by IsntDave
    @Exportable([IsntDave, Export.Allowed])
    @Column
    unseenByDave: string;
}
```

## Exporting
Based on the information provided earlier

```ts
const userDave = await User.findOne({ where: { name: "Dave" } })

if (userDave !== null) {
    const dataDave = userDave.Export(userDave)
    // According to the rules defined above the only exposed fields will be
    // name, session_token
}
```
