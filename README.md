# ebullient.github.io

Customized github minimal theme. Built using Docker to avoid the annoyance of maintaining a local ruby development environment (with apologies to lovers of Ruby).

## Updating jekyll

To update jekyll package versions (Gemfile.lock):

```
docker run --rm --label=jekyll --volume=$(pwd):/srv/jekyll -it  jekyll/jekyll:pages bundle update
```

Then rebuild the custom container (relies on existing/accurate Gemfile.lock):

```
docker-compose build
docker-compose up
```
