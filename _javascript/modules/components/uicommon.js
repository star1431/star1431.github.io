/** js호출 페이지 찾기용 */
class TargetJsFind {
  constructor() {
    console.log('해당파일 맞네?');
  }
}

/** 메인페이지 three js 적용 */
// class MainVisual {
//   constructor() {
//     this.mainWrap = document.querySelector('.main-visual');
//     const canvasElement = document.querySelector('.threejs-canvas');
//     if (!canvasElement) return;

//     // Renderer
//     const renderer = new THREE.WebGLRenderer({ canvas: canvasElement });
//     renderer.setSize(this.mainWrap.clientWidth, this.mainWrap.clientHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);

//     // Scene
//     const scene = new THREE.Scene();

//     // Camera
//     const camera = new THREE.PerspectiveCamera(
//       75, // 시야각(Field of View, FOV)
//       this.mainWrap.clientWidth / this.mainWrap.clientHeight, // 종횡비(Aspect Ratio) 수정
//       0.1, // 근접 클리핑 평면(Near)
//       100 // 원거리 클리핑 평면(Far)
//     );
//     camera.position.z = 2; // 카메라 위치 조정

//     // updataSize
//     this.renderer = renderer; // renderer를 인스턴스 변수로 저장
//     this.camera = camera; // camera를 인스턴스 변수로 저장
//     this.updateSize(); // 처음에 캔버스 크기 업데이트
//     window.addEventListener('resize', () => this.updateSize()); // 창 크기가 변경될 때 캔버스 크기 업데이트

//     // 오각형 정점 생성
//     const vertices = new Float32Array([
//       0.0,
//       1.0,
//       0.0, // 상단 중앙
//       -0.951,
//       0.309,
//       0.0, // 왼쪽 아래
//       -0.588,
//       -0.809,
//       0.0, // 왼쪽 아래 더
//       0.588,
//       -0.809,
//       0.0, // 오른쪽 아래 더
//       0.951,
//       0.309,
//       0.0, // 오른쪽 아래
//       0.0,
//       1.0,
//       0.0 // 상단 중앙 - 오각형을 닫기 위해 처음 점을 다시 추가
//     ]);

//     // Geometry
//     const geometry = new THREE.BufferGeometry();
//     geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

//     // Material
//     const material = new THREE.MeshBasicMaterial({
//       color: 0x0000ff,
//       side: THREE.DoubleSide
//     });

//     // Mesh
//     const mesh = new THREE.Mesh(geometry, material);
//     scene.add(mesh);

//     // Animation
//     const animate = () => {
//       requestAnimationFrame(animate);

//       mesh.rotation.x += 0.01; // x축을 기준으로 회전
//       mesh.rotation.y += 0.01; // y축을 기준으로 회전

//       this.renderer.render(scene, this.camera);
//     };

//     animate(); // 애니메이션 시작
//   }
//   updateSize() {
//     const width = this.mainWrap.clientWidth;
//     const height = this.mainWrap.clientHeight;

//     this.renderer.setSize(width, height); // 렌더러 크기 업데이트
//     this.camera.aspect = width / height; // 카메라 종횡비 업데이트
//     this.camera.updateProjectionMatrix(); // 카메라 투영 행렬 업데이트
//   }
// }

class MainVisual {
  // 생성자
  constructor() {
    this.mainWrap = document.querySelector('.main-visual');
    const canvasElement = document.querySelector('.threejs-canvas');
    if (!canvasElement) return;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvasElement,
      antialias: true
    });
    this.renderer.setSize(
      // 컨테이너 기준 지정
      this.mainWrap.clientWidth,
      this.mainWrap.clientHeight
    );
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75, // 시야각(Field of View, FOV)
      this.mainWrap.clientWidth / this.mainWrap.clientHeight, // 종횡비(Aspect Ratio) 수정
      0.1, // 근접 클리핑 평면(Near)
      500 // 원거리 클리핑 평면(Far)
    );
    this.camera.position.z = 5; // 카메라 위치 조정

    // 별 생성
    this.createStars();

    // 윈도우 크기 변경에 대응
    this.updateSize();
    window.addEventListener('resize', () => this.updateSize());

    // 마우스 효과
    this.mouseX = 0;
    this.mouseY = 0;
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // 애니메이션 시작
    this.animate();
  }

  // 별모양 컨트롤
  createStarTexture() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // 랜덤 색상 생성
    const starColor = this.generateRandomColor(1);

    // 별 중심에 놓을 텍스트의 색상을 랜덤 색상으로 설정
    ctx.fillStyle = starColor;
    ctx.textAlign = 'center';
    ctx.font = '128px Arial';
    ctx.fillText('✶', size / 2, size / 1.5);

    // 반짝이는 효과를 위한 그라데이션 추가
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      10,
      size / 2,
      size / 2,
      100
    );
    gradient.addColorStop(0, starColor); // 별의 중심 색상과 동일
    gradient.addColorStop(
      0.2,
      this.generateRandomColorWithAlpha(starColor, 0.5)
    ); // 투명도 조정
    gradient.addColorStop(
      0.4,
      this.generateRandomColorWithAlpha(starColor, 0.2)
    ); // 투명도 조정
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // 완전 투명
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 100, 0, 2 * Math.PI);
    ctx.fill();

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    return texture;
  }

  // 별생성 컨트롤
  createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const color = new THREE.Color();

    for (let i = 0; i < 5000; i++) {
      positions.push(THREE.MathUtils.randFloatSpread(1000)); // x
      positions.push(THREE.MathUtils.randFloatSpread(1000)); // y
      positions.push(THREE.MathUtils.randFloatSpread(500)); // z

      color.setHSL(Math.random(), 1.0, 0.5);
      colors.push(color.r, color.g, color.b);
    }

    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    starsGeometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      map: this.createStarTexture(),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true
    });

    this.stars = new THREE.Points(starsGeometry, starsMaterial);
    this.scene.add(this.stars);
  }

  // 별 랜덤 색상
  generateRandomColor(alpha = 1) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // 광원 색상
  generateRandomColorWithAlpha(color, alpha) {
    const match = color.match(/\d+/g);
    if (match && match.length >= 3) {
      const [r, g, b] = match;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color; // 일치하는 형식이 없다면 기본 색상 반환
  }

  // 배경 카메라 초점 효과
  animate() {
    requestAnimationFrame(() => this.animate());

    this.stars.rotation.x += 0.0005;
    this.stars.rotation.y += 0.0005;
    this.updateCameraPosition(); // 카메라 시점 조정

    this.renderer.render(this.scene, this.camera);
  }

  // 브라우저 리사이징
  updateSize() {
    const width = this.mainWrap.clientWidth;
    const height = this.mainWrap.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  // 마우스 핸들러
  onMouseMove(e) {
    // 화면 크기에 따른 마우스 위치의 정규화
    this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  // 마우스 초점 카메라 조정
  updateCameraPosition() {
    // 카메라 위치를 마우스 위치에 따라 약간 조정하여 시각적 효과를 줌
    const targetX = this.mouseX * 4;
    const targetY = this.mouseY * 4;
    // 카메라의 위치를 부드럽게 조정
    this.camera.position.x += (targetX - this.camera.position.x) * 0.5;
    this.camera.position.y += (targetY - this.camera.position.y) * 0.5;

    // 카메라가 항상 씬의 중앙을 바라보도록 함
    this.camera.lookAt(this.scene.position);
  }
}

/** 스크롤 헤더롤링 핸들러 */
class HeaderScrollHandler {
  constructor() {
    this.HeaderElements = document.querySelector('#topbar-wrapper');
    this.lastScrollTop = 0;
    this.initScrollEvents = true;
    // 탑바 존재 여부 이벤트 제어
    if (this.HeaderElements) {
      this.scrollEventBinding = this.onScrollEvent.bind(this);
      window.addEventListener('scroll', this.scrollEventBinding);

      setTimeout(() => {
        this.initScrollEvents = false;
      }, 150);
    }
  }

  // 스크롤시 탑바 event
  onScrollEvent() {
    let currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > this.lastScrollTop) {
      // 스크롤 다운
      this.HeaderElements.classList.add('topbar-scroll-down');
    } else {
      // 스크롤 업
      this.HeaderElements.classList.remove('topbar-scroll-down');
    }
    this.lastScrollTop = currentScroll;
  }

  destroy() {
    window.removeEventListener('scroll', this.scrollEventBinding);
  }
}

export const targetJsFind = () => new TargetJsFind();
export const mainVisual = () => new MainVisual();
export const headerScrollHandler = () => new HeaderScrollHandler();
