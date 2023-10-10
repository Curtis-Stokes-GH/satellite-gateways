# Satellite gateway backend
This is a standard django rest project with a provided database to already have representative data.

This does include basic session authentication, largely as a learning exercise and to get familiar
with more  django specific concepts.

Developed against python version `Python 3.11.6`.

I'm sure I may have missed an idiomatic pattern or two (such as using reverse to get urls
in tests that I noticed quite late) and perhaps some routes could be simplified using
pure api views.

## Running the application
Install dependencies from requirements.txt within a venv.

Then run `python manage.py runserver` and it will be available under `http://localhost:8000`

**Note:** It is expected to be used with the react frontend and has cors set up for the default
serving url of dev. In production this should run using gunicorn or similar, likely via a nginx
reverse proxy serving both apps under the same fqdn.

## Testing the application
Run `python manage.py test`

Some very simple components have tests omitted due to lack of value.

## Precommit hooks
Various python tools such as flake8 and black are setup in the .pre-commit-config.yaml.
Please see [pre-commit(https://pre-commit.com/) for more information but these can also
be run manually easily with `pre-commit` when in the venv.
