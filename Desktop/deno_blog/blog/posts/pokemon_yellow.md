---
title: Remaking Pokemon Yellow in Godot [WIP]
publish_date: 2022-09-22
---

Alex used Godot, it was super effective.

![image](https://user-images.githubusercontent.com/44316926/191697516-737d9f3d-79cc-402b-bb14-6046ea4c4528.png)

This post is a WIP but I'll document my development of the game + the accompanying code so you can follow along.

### Creating the Main Character

First, I created a "Player" scene that contains an AnimatedSprite & a CollisionShape2D. I created the player animations in [Piskel](piskelapp.com)

https://www.loom.com/share/7ef3a576c5744129862a77acf13c3183

I then added code to make the player's animations dynamic & to enable the player to move. The code below is "GDScript" which is Godot's DSL that resembles Python. 

```
extends KinematicBody2D

export var speed = 400
var screen_size

func _ready():
	screen_size = get_viewport_rect().size
		
func _physics_process(delta):
	var velocity = Vector2.ZERO # The player's movement vector.
	if Input.is_action_pressed("move_right"):
		velocity.x += 1
	if Input.is_action_pressed("move_left"):
		velocity.x -= 1
	if Input.is_action_pressed("move_down"):
		velocity.y += 1
	if Input.is_action_pressed("move_up"):
		velocity.y -= 1		

	if velocity.length() > 0:
		velocity = velocity.normalized() * speed
		$AnimatedSprite.play()
	else:
		$AnimatedSprite.stop()
		
	position += velocity * delta

	if velocity.x != 0:
		$AnimatedSprite.animation = "Walking_Sideways"
		$AnimatedSprite.flip_v = false
		$AnimatedSprite.flip_h = velocity.x < 0
	if velocity.y > 0:
		$AnimatedSprite.animation = "Walking_Down"
	elif velocity.y < 0:
		$AnimatedSprite.animation = "Walking_Up"

	move_and_collide(velocity * delta)
  
```
### Creating Pallet Town

I found a Pallet Town sprite sheet & edited it in Figma. I used CollisionPolygon2D to create custom collision shapes in order to allow the player to walk on top of doors.

https://www.loom.com/share/6ab42f0c40b54b29aeb368d481b20925

### Creating a Menu

I'm currently creating the popupmenu which a player can use to save their game, check out their inventory, etc. 

https://www.loom.com/share/9bfb10ab4cb041498de85d1b6d977ab3

Basic code below. 

