const inquirer = require('inquirer');
const Consola = require('consola');

enum Action {
  List = 'list',
  Add = 'add',
  Edit = 'edit',
  Remove = 'remove',
  Quit = 'quit',
}

enum MessageVariant {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

type InquirerAnswers = {
  action: Action;
};

class Message {
  private content: string;

  constructor(content: string) {
    this.content = content;
  }

  public show(): string {
    return this.content;
  }

  public capitalize(): void {
    this.content =
      this.content.charAt(0).toUpperCase() +
      this.content.slice(1).toLowerCase();
  }

  public toUpperCase(): void {
    this.content = this.content.toUpperCase();
  }

  public toLowerCase(): void {
    this.content = this.content.toLowerCase();
  }

  public static showColorized(variant: MessageVariant, text: string): void {
    switch (variant) {
      case MessageVariant.Success:
        Consola.success(text);
        break;
      case MessageVariant.Error:
        Consola.error(text);
        break;
      case MessageVariant.Info:
        Consola.info(text);
        break;
    }
  }
}

interface User {
  name: string;
  age: number;
}

class UserData {
  private data: User[] = [];

  public showAll(): void {
    const message = new Message('User data');
    const content = message.show();
    Message.showColorized(MessageVariant.Info, content);

    if (this.data.length > 0) {
      console.table(this.data);
    } else {
      console.log('No data...');
    }
  }

  public add(user: User): void {
    if (
      typeof user.name === 'string' &&
      user.name.length > 0 &&
      typeof user.age === 'number' &&
      user.age > 0
    ) {
      this.data.push(user);
      Message.showColorized(
        MessageVariant.Success,
        'User has been successfully added!'
      );
    } else {
      Message.showColorized(MessageVariant.Error, 'Wrong data!');
    }
  }

  public edit(userName: string, editedUser: User): void {
    const index = this.data.findIndex((user) => user.name === userName);
    if (index !== -1) {
      const userToUpdate = this.data[index];
      if (editedUser.name && typeof editedUser.name === 'string') {
        userToUpdate.name = editedUser.name;
      }
      if (editedUser.age && typeof editedUser.age === 'number') {
        userToUpdate.age = editedUser.age;

        Message.showColorized(
          MessageVariant.Success,
          'User has been successfully modified!'
        );
      } else {
        Message.showColorized(
          MessageVariant.Info,
          'User has been successfully modified!'
        );
      }
    } else {
      Message.showColorized(MessageVariant.Error, 'User not found...');
    }
  }

  public remove(userName: string): void {
    const index = this.data.findIndex((user) => user.name === userName);
    if (index !== -1) {
      this.data.splice(index, 1);
      Message.showColorized(MessageVariant.Success, 'User deleted!');
    } else {
      Message.showColorized(MessageVariant.Error, 'User not found...');
    }
  }
}

const users = new UserData();
console.log('\n');
console.info('???? Welcome to the UsersApp!');
console.log('====================================');
Message.showColorized(MessageVariant.Info, 'Available actions');
console.log('\n');
console.log('list – show all users');
console.log('add – add new user to the list');
console.log('edit – edit user from the list');
console.log('remove – remove user from the list');
console.log('quit – quit the app');
console.log('\n');

const startApp = () => {
  inquirer
    .prompt([
      {
        name: 'action',
        type: 'input',
        message: 'How can I help you?',
      },
    ])
    .then(async (answers: InquirerAnswers) => {
      switch (answers.action) {
        case Action.List:
          users.showAll();
          break;
        case Action.Add:
          const user = await inquirer.prompt([
            {
              name: 'name',
              type: 'input',
              message: 'Enter name',
            },
            {
              name: 'age',
              type: 'number',
              message: 'Enter age',
            },
          ]);
          users.add(user);
          break;
        case Action.Edit:
          const userToEdit = await inquirer.prompt([
            {
              name: 'name',
              type: 'input',
              message: 'Enter name to edit',
            },
          ]);
          const editedUser = await inquirer.prompt([
            {
              name: 'name',
              type: 'input',
              message: 'Change name',
            },
            {
              name: 'age',
              type: 'number',
              message: 'Change age',
            },
          ]);
          users.edit(userToEdit.name, editedUser);
          break;
        case Action.Remove:
          const name = await inquirer.prompt([
            {
              name: 'name',
              type: 'input',
              message: 'Enter name',
            },
          ]);
          users.remove(name.name);
          break;
        case Action.Quit:
          Message.showColorized(MessageVariant.Info, 'Bye bye!');
          return;
        default:
          Message.showColorized(MessageVariant.Info, 'Command not found!');
      }

      startApp();
    });
};
startApp();
