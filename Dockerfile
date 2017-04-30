FROM jekyll/jekyll:pages
MAINTAINER Erin Schnabel <schnabel@us.ibm.com>

COPY Gemfile /srv/jekyll
COPY Gemfile.lock /srv/jekyll

RUN apk add --update libxml2-dev libxslt-dev \
    && bundle install \
	&& rm -rf /var/cache/apk/*
