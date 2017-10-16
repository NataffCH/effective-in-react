# Pursuance

## Getting Started

Please fork and clone down this repository to your local machine.

If you don't have React.js globally installed, run this command in your command line:

```
npm install -g create-react-app
```

Next, change directory into the `pursuance` folder.

Run this command to install node modules:

```
npm install
```

To run the React App on localhost:

```
npm start
```

Then, in another terminal, to set up the database and run PostgREST,
which our Go code uses for persistence, run:

``` $ cd db/ ```

If you're on Linux, now run

``` $ sudo -u postgres bash init_sql.sh ```

On Mac OS X, instead run

``` $ sudo -u $USER bash init_sql.sh ```

(The following commands should be run regardless of whether you're on
Linux or OS X.)

``` $ postgrest postgrest.conf ```

Then, in another terminal session run:

``` $ go get ./... ```

(An error about not finding `github.com/PursuanceProject/pursuance` is
OK here.)

``` $ go build ```

``` $ ./pursuance ```

Then view <http://localhost:8082>.


## Conventions

Please follow these naming and spacing conventions when submitting a pull request: [React + Redux Conventions](https://unbug.gitbooks.io/react-native-training/content/45_naming_convention.html)
