//#version 330 compatibility
uniform sampler2D               uTexUnit;
uniform sampler2D               uImageUnit;

varying vec2            vST;
varying float           uSc, uTc;
varying float           uRad, uMag, uWhirl, uMosaic;

void 
main()
{
    vec2 st = vST - vec2(uSc, uTc);

    if(dot(st, st) > uRad * uRad)// current fragment is outside uRad 
    {
        vec3 rgb = texture2D( uImageUnit, vST ).rgb;
        gl_FragColor = vec4( rgb, 1. );
    }
    else
    {
        // Magnifying:
        float r = length( st );
	    float rPrime = r*uMag;  //

        // Whirling:
        float theta  = atan( st.t, st.s );
        float thetaPrime = theta - uWhirl * rPrime;

        // Restoring:
        st = rPrime * vec2( cos(thetaPrime),sin(thetaPrime) );      // now in the range -1. to +1.
	    st += vec2(uSc, uTc);

        //Mosaic'ing
        // which block of pixels will this pixel be in?
        float blockCount = uMosaic;         // Number of mosaic blocks per dimension
        float blockSize  = 1.0 / blockCount;

        // Which integer block (row,col) are we in?
        int numins = int(floor(st.s / blockSize));
        int numint = int(floor(st.t / blockSize));
        // Center of that block (sc,tc)
        float sc = (float(numins) + 0.5) * blockSize;
        float tc = (float(numint) + 0.5) * blockSize;
        // for this entire block of pixels, we are only going to sample the texture2D at its center (sc,tc):
        st.s = sc;
        st.t = tc;

        vec3 rgb = texture2D( uImageUnit, st ).rgb;
	    gl_FragColor = vec4( rgb, 1. );
    }


}