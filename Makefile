.PHONY: all astro resume

all: astro resume

astro:
	deno task build

resume: dist/resume.pdf

dist/resume.pdf: src/resume.md src/styles/resume.css
	mkdir -p dist
	pandoc $< -o $@ --pdf-engine=weasyprint --css src/styles/resume.css