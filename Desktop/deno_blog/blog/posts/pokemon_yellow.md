---
title: Remaking Pokemon Yellow in Godot [WIP]
publish_date: 2022-09-22
---

Alex used Godot, it was super effective.

![image](https://user-images.githubusercontent.com/44316926/191697516-737d9f3d-79cc-402b-bb14-6046ea4c4528.png)

This post is a WIP but I'll document my development of the game + the accompanying code so you can follow along.

### Creating the Main Character

First, I created a "Player" scene that contains an AnimatedSprite & a CollisionShape2D. I created the player animations in [Piskel](piskelapp.com)

<a href="https://www.loom.com/share/7ef3a576c5744129862a77acf13c3183">
    <p>Pokemon_Yellow_Remastered - Godot Engine - Watch Video</p>
    <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/7ef3a576c5744129862a77acf13c3183-with-play.gif">
</a>


I then added code to make the player's animations dynamic & to enable the player to move. The code below is written in "GDScript", Godot's DSL that resembles Python. 


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

In time, when a player steps on these doors they'll "enter" the house.

<a href="https://www.loom.com/share/6ab42f0c40b54b29aeb368d481b20925">
    <p>Godot - Player Scene - Watch Video</p>
    <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/6ab42f0c40b54b29aeb368d481b20925-with-play.gif">
</a>


### Creating a Menu

I'm currently creating a popup menu that's triggered by pressing the "M" key & closed via pressing the "Esc" key or pressing "Enter" on the "Exit" menu option. 

Note, when the popup menu is opened, the arrow keys typically used to move the Player must now instead, be used to navigate the menu.

I used Godot's "Focus" UI properties to enable an event-based navigation arrow that corresponds to the appropriate arrow keys. 

<a href="https://www.loom.com/share/b469657f1b3e4cdaa896fcca137f3bb2">
    <p>Godot - Main Menu Scene</p>
    <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/b469657f1b3e4cdaa896fcca137f3bb2-with-play.gif">
</a>

<br></br>
See main menu code below. Go easy on me, I'll refactor l8r.

```
extends Node

signal menu_opened
signal menu_closed

func _ready():
	$Menu.hide()
	$Menu/VBoxContainer/Pokedex/Arrow1.hide()
	$Menu/VBoxContainer/Pokemon/Arrow2.hide()
	$Menu/VBoxContainer/Item/Arrow3.hide()
	$Menu/VBoxContainer/Ash/Arrow4.hide()
	$Menu/VBoxContainer/Save/Arrow5.hide()
	$Menu/VBoxContainer/Option/Arrow6.hide()
	$Menu/VBoxContainer/Exit/Arrow7.hide()
	
	
func _process(delta):
	if Input.is_action_pressed("Menu_Open"):
		$Menu.show()
		$Menu/VBoxContainer/Pokedex.grab_focus()
		emit_signal("menu_opened")
	
	if Input.is_action_pressed("Menu_Close"):
		$Menu.hide()
		emit_signal("menu_closed")
	
# Arrow navigation.		
	
func _on_Pokedex_focus_entered():
	$Menu/VBoxContainer/Pokedex/Arrow1.show()

func _on_Pokedex_focus_exited():
	$Menu/VBoxContainer/Pokedex/Arrow1.hide()	

func _on_Pokemon_focus_entered():
	$Menu/VBoxContainer/Pokemon/Arrow2.show()

func _on_Pokemon_focus_exited():
	$Menu/VBoxContainer/Pokemon/Arrow2.hide()

func _on_Item_focus_entered():
	$Menu/VBoxContainer/Item/Arrow3.show()

func _on_Item_focus_exited():
	$Menu/VBoxContainer/Item/Arrow3.hide()

func _on_Ash_focus_entered():
	$Menu/VBoxContainer/Ash/Arrow4.show()

func _on_Ash_focus_exited():
	$Menu/VBoxContainer/Ash/Arrow4.hide()

func _on_Save_focus_entered():
	$Menu/VBoxContainer/Save/Arrow5.show()

func _on_Save_focus_exited():
	$Menu/VBoxContainer/Save/Arrow5.hide()

func _on_Option_focus_entered():
	$Menu/VBoxContainer/Option/Arrow6.show()

func _on_Option_focus_exited():
	$Menu/VBoxContainer/Option/Arrow6.hide()

func _on_Exit_focus_entered():
	$Menu/VBoxContainer/Exit/Arrow7.show()

func _on_Exit_focus_exited():
	$Menu/VBoxContainer/Exit/Arrow7.hide()

```

Next, I created a sub menu for each item. This was pretty straightforward given I already built the UI focus logic. I plan on returning to the "Save" sub menu later once I grok working with databases/storage via Godot.  

<div style="position: relative; padding-bottom: 62.5%; height: 0;"><iframe src="https://www.loom.com/embed/cb2caaab940e4fc5b1ffc7650a0bd75e" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

```
if $Menu.visible == true:
		if $Menu/VBoxContainer/Exit.has_focus():
			if Input.is_action_pressed("ui_select"):
				emit_signal("menu_closed")
				$Menu.hide()
		
		if $Menu/VBoxContainer/Pokedex.has_focus():
			if Input.is_action_pressed("ui_select"):
				$Menu/Haunter.show()
			if Input.is_action_pressed("ui_back"):
				$Menu/Haunter.hide()

```

I had a bunch of fun building Professor Oak's Lab & the "scene switching" logic. Essentially what happens here is that when my animated spite enters the collision path of Oak's Lab's door, a signal fires which causes the "Oak's Lab" scene to be loaded. 

<a href="https://www.loom.com/share/2472d31034ff42a49c39cdc81c597396">
    <p>Loom Message - 9 October 2022 - Watch Video</p>
    <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/2472d31034ff42a49c39cdc81c597396-with-play.gif">
</a>

Pallet Town script. 

```
extends Control

func _on_Area2D_body_entered(body):
	get_tree().change_scene("res://OaksLab.tscn")
```

Oak's Lab script. 

```
extends Node2D

signal exited_oaks_lab_interior

func _on_Area2D_body_entered(body):
	emit_signal("location_changed")
	get_tree().change_scene("res://Main.tscn")
```

Admittedly what I have not figured out yet (tips welcome!) is how to change the starting position of my animated sprite when exiting Oak's Lab so that the sprite appears as though he's just exited the door of the lab. Something to do with changing the position variable's value based on signals I suspect.

I've just added a camera to the game which was pretty simple but has added a real sense of presence to the world.

<a href="https://www.loom.com/share/873b7041192441e893512ba95af3021c">
    <p>Loom Message - 9 October 2022 - Watch Video</p>
    <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/873b7041192441e893512ba95af3021c-with-play.gif">
</a>
