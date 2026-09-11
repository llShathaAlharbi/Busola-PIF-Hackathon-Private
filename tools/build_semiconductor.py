"""Build a conceptual wire-bond IC package in Blender and export named GLB groups."""
import bpy, math, os
from mathutils import Vector

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
out = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets'))

def material(name, color, metallic=0.0):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Metallic'].default_value = metallic
    bsdf.inputs['Roughness'].default_value = .28
    return m

gold = material('Copper gold', (.67,.43,.15), .8)
silicon = material('Silicon blue', (.08,.18,.30), .75)
resin = material('Protective resin', (.045,.07,.065), .15)
attach = material('Die attach silver', (.6,.65,.67), .75)
trace = material('Circuit traces', (.32,.64,.68), .7)
groups={}
for name in ['leadframe','attach','die','wires','mold']:
    group=bpy.data.objects.new(name,None)
    bpy.context.collection.objects.link(group)
    group['part_id']=name
    groups[name]=group

def box(name, xyz, scale, mat, group, bevel=.04):
    bpy.ops.mesh.primitive_cube_add(size=1, location=xyz)
    obj=bpy.context.object
    obj.name=name
    obj.dimensions=scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    if bevel:
        mod=obj.modifiers.new('Soft manufactured edge','BEVEL')
        mod.width=bevel;mod.segments=3
        bpy.ops.object.modifier_apply(modifier=mod.name)
        obj.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
    obj.parent=groups[group]
    return obj

box('Die paddle',(0,0,0),(2.05,2.05,.12),gold,'leadframe')
for side in range(4):
    for i in range(10):
        t=(i-4.5)*.38
        if side<2:
            xyz=(t,(-1 if side==0 else 1)*2.05,0)
            size=(.18,1.6,.10)
        else:
            xyz=((-1 if side==2 else 1)*2.05,t,0)
            size=(1.6,.18,.10)
        box('Lead_%s_%s'%(side,i),xyz,size,gold,'leadframe',.02)
box('Conductive adhesive',(0,0,.105),(1.87,1.87,.065),attach,'attach',.01)
box('Silicon die',(0,0,.22),(1.8,1.8,.17),silicon,'die',.025)
for i in range(7):
    for j in range(7):
        box('Circuit cell',( (i-3)*.22,(j-3)*.22,.309),(.16,.16,.012),trace,'die',.008)
for side in range(4):
    for i in range(8):
        t=(i-3.5)*.20
        start=Vector((t,.87,.32));end=Vector((t*1.8,1.7,.06))
        angle=side*math.pi/2
        def rotate(v):return Vector((v.x*math.cos(angle)-v.y*math.sin(angle),v.x*math.sin(angle)+v.y*math.cos(angle),v.z))
        start=rotate(start);end=rotate(end)
        mid=(start+end)/2;mid.z=.68
        curve=bpy.data.curves.new('Bond wire','CURVE');curve.dimensions='3D'
        curve.bevel_depth=.016;curve.bevel_resolution=3
        spline=curve.splines.new('BEZIER');spline.bezier_points.add(2)
        for point,co in zip(spline.bezier_points,[start,mid,end]):
            point.co=co;point.handle_left_type='AUTO';point.handle_right_type='AUTO'
        obj=bpy.data.objects.new('Wire_%s_%s'%(side,i),curve)
        bpy.context.collection.objects.link(obj);obj.data.materials.append(gold)
        obj.parent=groups['wires']
        bpy.context.view_layer.objects.active=obj;obj.select_set(True)
        bpy.ops.object.convert(target='MESH');obj.select_set(False)
# Removed top half of encapsulation is represented as a single pedagogical cap.
box('Molded cap',(0,0,.75),(4.1,4.1,.35),resin,'mold',.12)
for i in range(3):box('Package marking',(-.8, .4-i*.24,.932),(1.5-i*.3,.04,.006),attach,'mold',0)

# Author the same exploded-view motion in the .blend and GLB animation.
for name, distance in {'leadframe':0,'attach':.85,'die':1.65,'wires':2.65,'mold':3.65}.items():
    obj=groups[name]
    obj.location=(0,0,0);obj.keyframe_insert(data_path='location',frame=1)
    obj.location=(0,0,distance);obj.keyframe_insert(data_path='location',frame=72)
    if obj.animation_data:
        obj.animation_data.action.name='Explode_'+name
bpy.context.scene.frame_end=72
bpy.context.scene.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,'semiconductor.blend'))
bpy.ops.export_scene.gltf(filepath=os.path.join(out,'semiconductor.glb'),export_format='GLB',export_extras=True,export_animations=True)
print('BUSOLA: Blender source and animated GLB exported.')
