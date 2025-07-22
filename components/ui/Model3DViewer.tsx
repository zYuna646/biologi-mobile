import { Asset } from 'expo-asset';
import { GLView } from 'expo-gl';
import { Renderer, loadAsync } from 'expo-three';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as THREE from 'three';

interface Model3DViewerProps {
  modelSource: any;
  width?: number;
  height?: number;
  autoRotate?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export const Model3DViewer: React.FC<Model3DViewerProps> = ({
  modelSource,
  width = screenWidth - 40,
  height = 300,
  autoRotate = true,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const timeRef = useRef(0);
  const rendererRef = useRef<Renderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const manualRotationRef = useRef({ x: 0, y: 0 });
  const lastPanRef = useRef({ x: 0, y: 0 });

  const onContextCreate = async (gl: any) => {
    try {
      setLoading(true);
      setError(null);

      // Create renderer
      const renderer = new Renderer({ gl });
      renderer.setSize(width, height);
      renderer.setClearColor(0xf0f0f0, 1);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;

      // Create scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Create camera
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 0, 3);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // Add lights
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      // Load model
      await loadModel(scene);

      setLoading(false);

      // Start render loop
      const render = () => {
        timeRef.current += 0.01;

        // Apply rotations
        if (modelRef.current) {
          if (isRotating) {
            // Auto rotation + manual rotation
            modelRef.current.rotation.y = timeRef.current * 0.5 + manualRotationRef.current.y;
            modelRef.current.rotation.x = manualRotationRef.current.x;
          } else {
            // Manual rotation only
            modelRef.current.rotation.y = manualRotationRef.current.y;
            modelRef.current.rotation.x = manualRotationRef.current.x;
          }
        }

        renderer.render(scene, camera);
        
        // Use proper Expo GL frame ending
        if (gl.endFrameEXP) {
          gl.endFrameEXP();
        }

        requestAnimationFrame(render);
      };
      render();

    } catch (err) {
      console.error('Error initializing 3D viewer:', err);
      setError('Gagal memuat model 3D');
      setLoading(false);
    }
  };

      const loadModel = async (scene: THREE.Scene) => {
    try {
      console.log('Loading GLB model:', modelSource);
      
      // Load the actual GLB model using expo-three's loadAsync
      const asset = Asset.fromModule(modelSource);
      await asset.downloadAsync();
      
      console.log('Asset downloaded, loading GLTF...');
      const gltf = await loadAsync(asset.localUri || asset.uri);
      
      if (!gltf || !gltf.scene) {
        throw new Error('Failed to load GLTF model - no scene found');
      }

      console.log('GLTF loaded successfully');
      const modelGroup = gltf.scene.clone();
      
             // Configure all meshes in the model
       modelGroup.traverse((child: THREE.Object3D) => {
         if (child instanceof THREE.Mesh) {
           // Enable shadows
           child.castShadow = true;
           child.receiveShadow = true;
           
           // Fix materials and remove problematic textures
           if (child.material) {
             if (Array.isArray(child.material)) {
               child.material.forEach((material: THREE.Material, index: number) => {
                 const newMaterial = createCompatibleMaterial(material);
                 (child.material as THREE.Material[])[index] = newMaterial;
               });
             } else {
               child.material = createCompatibleMaterial(child.material);
             }
           }
         }
       });
      
      modelRef.current = modelGroup;
      scene.add(modelGroup);

      // Center and scale the model
      const box = new THREE.Box3().setFromObject(modelGroup);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      console.log('Model bounds:', { center, size });
      
      // Set model to exact center
      modelGroup.position.set(-center.x, -center.y, -center.z);
      
      // Scale model to fit nicely in view
      const maxDimension = Math.max(size.x, size.y, size.z);
      const scale = maxDimension > 0 ? 2.0 / maxDimension : 1;
      modelGroup.scale.set(scale, scale, scale);

      console.log(`GLB model loaded successfully with scale: ${scale}`);
      
    } catch (error) {
      console.error('Error loading GLB model:', error);
      
      // Fallback to a simple placeholder if GLB loading fails
      console.log('Loading fallback placeholder model');
      
      const fallbackGeometry = new THREE.BoxGeometry(1, 1, 1);
      const fallbackMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xFF5722,
        wireframe: true
      });
      const fallbackMesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
      fallbackMesh.castShadow = true;
      fallbackMesh.receiveShadow = true;

      const fallbackGroup = new THREE.Group();
      fallbackGroup.add(fallbackMesh);
      
      modelRef.current = fallbackGroup;
      scene.add(fallbackGroup);
      
      // Set error state
      setError('Model GLB gagal dimuat');
    }
  };

  const createCompatibleMaterial = (originalMaterial: THREE.Material): THREE.Material => {
    // Create a simple material without textures to avoid loading issues
    if (originalMaterial instanceof THREE.MeshStandardMaterial || 
        originalMaterial instanceof THREE.MeshPhongMaterial) {
      return new THREE.MeshPhongMaterial({
        color: originalMaterial.color || new THREE.Color(0x8FA1A7),
        transparent: originalMaterial.transparent,
        opacity: originalMaterial.opacity,
        shininess: 30,
        // Don't include maps to avoid texture loading issues
      });
    }
    
    // For other material types, create a basic material
    return new THREE.MeshPhongMaterial({
      color: 0x8FA1A7,
      shininess: 30
    });
  };

  const resetView = () => {
    if (cameraRef.current && modelRef.current) {
      cameraRef.current.position.set(0, 0, 3);
      cameraRef.current.lookAt(0, 0, 0);
      modelRef.current.rotation.set(0, 0, 0);
      modelRef.current.position.set(0, 0, 0);
      manualRotationRef.current = { x: 0, y: 0 };
      timeRef.current = 0;
    }
  };

  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };

  const focusModel = () => {
    if (cameraRef.current && modelRef.current) {
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());
      
      cameraRef.current.position.copy(center);
      cameraRef.current.position.x += size;
      cameraRef.current.position.y += size * 0.5;
      cameraRef.current.position.z += size;
      cameraRef.current.lookAt(center);
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      lastPanRef.current = { x: 0, y: 0 };
    },
    onPanResponderMove: (evt: any, gestureState: any) => {
      const { dx, dy } = gestureState;
      
      // Convert screen coordinates to rotation
      const rotationY = dx * 0.01;
      const rotationX = dy * 0.01;
      
      // Update manual rotation
      manualRotationRef.current.y += rotationY - lastPanRef.current.x;
      manualRotationRef.current.x += rotationX - lastPanRef.current.y;
      
      // Clamp X rotation to reasonable bounds
      manualRotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, manualRotationRef.current.x));
      
      lastPanRef.current = { x: rotationY, y: rotationX };
    },
    onPanResponderRelease: () => {
      lastPanRef.current = { x: 0, y: 0 };
    },
  });

  if (error) {
    return (
      <View style={[styles.container, { width, height }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorSubtext}>Model 3D tidak dapat dimuat</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width, height }]}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Memuat Model 3D...</Text>
        </View>
      )}
      
      <View 
        style={styles.gestureContainer}
        {...panResponder.panHandlers}
      >
        <GLView
          style={styles.glView}
          onContextCreate={onContextCreate}
        />
      </View>
      
      {!loading && !error && (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {isRotating ? '🔄 Auto rotate' : '👆 Geser untuk putar'}
            </Text>
          </View>
          
          <View style={styles.controlsContainer}>
            <TouchableOpacity style={styles.controlBtn} onPress={resetView}>
              <Text style={styles.controlBtnText}>🔄</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlBtn} onPress={toggleRotation}>
              <Text style={styles.controlBtnText}>{isRotating ? '⏸️' : '▶️'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlBtn} onPress={focusModel}>
              <Text style={styles.controlBtnText}>🔍</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  gestureContainer: {
    flex: 1,
  },
  glView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  errorSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  infoContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  infoText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    gap: 8,
  },
  controlBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlBtnText: {
    fontSize: 16,
  },
}); 